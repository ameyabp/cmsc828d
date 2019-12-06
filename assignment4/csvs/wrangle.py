import pandas as pd
import os
import re

if __name__ == '__main__':
    cwd = os.getcwd()
    csvFiles = [f for f in sorted(os.listdir(cwd)) if '.csv' in f]

    db = []
    for file in csvFiles:
        if 'compositeStorms' in file:
            continue
        print("reading file", file)
        # read everything as string for now to avoid the multiple data types warning
        df = pd.read_csv(file, delimiter=',', dtype=str)
        print(df.shape)
        db.append(df)

    # all inidividual data frames have been read without the headers
    # set ignore_index flag to True to avoid having the numbering restart for every concatenated dataframe
    colName2colIndexDict = {
    0:'BEGIN_YEARMONTH',
    1:'BEGIN_DAY',
    2:'BEGIN_TIME',
    3:'END_YEARMONTH',
    4:'END_DAY',
    5:'END_TIME',
    6:'EPISODE_ID',
    7:'EVENT_ID',
    8:'STATE',
    9:'STATE_FIPS',
    10:'YEAR',
    11:'MONTH_NAME',
    12:'EVENT_TYPE',
    13:'CZ_TYPE',
    14:'CZ_FIPS',
    15:'CZ_NAME',
    16:'WFO',
    17:'BEGIN_DATE_TIME',
    18:'CZ_TIMEZONE',
    19:'END_DATE_TIME',
    20:'INJURIES_DIRECT',
    21:'INJURIES_INDIRECT',
    22:'DEATHS_DIRECT',
    23:'DEATHS_INDIRECT',
    24:'DAMAGE_PROPERTY',
    25:'DAMAGE_CROPS',
    26:'SOURCE',
    27:'MAGNITUDE',
    28:'MAGNITUDE_TYPE',
    29:'FLOOD_CAUSE',
    30:'CATEGORY',
    31:'TOR_F_SCALE',
    32:'TOR_LENGTH',
    33:'TOR_WIDTH',
    34:'TOR_OTHER_WFO',
    35:'TOR_OTHER_CZ_STATE',
    36:'TOR_OTHER_CZ_FIPS',
    37:'TOR_OTHER_CZ_NAME',
    38:'BEGIN_RANGE',
    39:'BEGIN_AZIMUTH',
    40:'BEGIN_LOCATION',
    41:'END_RANGE',
    42:'END_AZIMUTH',
    43:'END_LOCATION',
    44:'BEGIN_LAT',
    45:'BEGIN_LON',
    46:'END_LAT',
    47:'END_LON',
    48:'EPISODE_NARRATIVE',
    49:'EVENT_NARRATIVE',
    50:'DATA_SOURCE'}

    compositeFrame = pd.concat(db, axis=0, ignore_index=True)
    numRows, numCols = compositeFrame.shape
    print(compositeFrame.shape)

    #print(frame[[colName2colIndexDict[i] for i in range(5)]])

    eventID = compositeFrame[colName2colIndexDict[7]].astype(int)
    state = compositeFrame[colName2colIndexDict[8]]
    stateFips = compositeFrame[colName2colIndexDict[9]]
    eventType = compositeFrame[colName2colIndexDict[12]]
    czmType = compositeFrame[colName2colIndexDict[13]]
    countyFips = compositeFrame[colName2colIndexDict[14]].astype(int)
    #countyName = compositeFrame[colName2colIndexDict[15]]#.str.split(',')
    lat = compositeFrame[colName2colIndexDict[44]].astype(float)
    lng = compositeFrame[colName2colIndexDict[45]].astype(float)
    beginDate = compositeFrame[colName2colIndexDict[17]].str[0:9:1]
    endDate = compositeFrame[colName2colIndexDict[19]].str[0:9:1]
    year = compositeFrame[colName2colIndexDict[0]].str[0:4:1].astype(int)
    injuriesDir = compositeFrame[colName2colIndexDict[20]].astype(int)
    injuriesInd = compositeFrame[colName2colIndexDict[21]].astype(int)
    deathsDir = compositeFrame[colName2colIndexDict[22]].astype(int)
    deathsInd = compositeFrame[colName2colIndexDict[23]].astype(int)
    damageProps = compositeFrame[colName2colIndexDict[24]].astype(str)
    damageCrops = compositeFrame[colName2colIndexDict[25]].astype(str)

    stateFip = []
    injuries = []
    deaths = []
    damage = []

    # rows to delete
    rowsToDel = []

    for i in range(numRows):
        damageProp = damageProps.iat[i]
        try:
            if 'K' in damageProp:
                damageProp = damageProp.replace('K', '')
                damageProp = re.sub("\D", "", damageProp)
                damageProp = float(damageProp)
            elif 'M' in damageProp:
                damageProp = damageProp.replace('M', '')
                damageProp = re.sub("\D", "", damageProp)
                damageProp = float(damageProp) * 1000
            elif 'B' in damageProp:
                damageProp = damageProp.replace('B', '')
                damageProp = re.sub("\D", "", damageProp)
                damageProp = float(damageProp) * 1000000
            else:
                damageProp = 0
        except ValueError:
            damageProp = 0

        damageCrop = damageCrops.iat[i]
        try:
            if 'K' in damageCrop:
                damageCrop = damageCrop.replace('K','')
                damageCrop = re.sub("\D", "", damageCrop)
                damageCrop = float(damageCrop)
            elif 'M' in damageCrop:
                damageCrop = damageCrop.replace('M','')
                damageCrop = re.sub("\D", "", damageCrop)
                damageCrop = float(damageCrop) * 1000
            elif 'B' in damageCrop:
                damageCrop = damageCrop.replace('B','')
                damageCrop = re.sub("\D", "", damageCrop)
                damageCrop = float(damageCrop) * 1000000
            else:
                damageCrop = 0
        except ValueError:
            damageCrop = 0

        damage.append(damageProp + damageCrop)
        deaths.append(deathsDir.iat[i] + deathsInd.iat[i])
        injuries.append(injuriesDir.iat[i] + injuriesInd.iat[i])

        try:
            fip = int(stateFips.iat[i])
            stateFip.append(fip)
        except ValueError:
            print("Dropping row", i, state.iat[i], stateFips.iat[i])
            stateFip.append(0)
            rowsToDel.append(i)

    stateFip = pd.Series(stateFip)
    deaths = pd.Series(deaths)
    damage = pd.Series(damage)
    injuries = pd.Series(injuries)

    #print(deaths.sample(10))
    #print(damage.sample(10))

    newFrame = {'eventID':eventID, 'eventType':eventType, 'state':state, 'stateFips':stateFip, 'czmType':czmType, 'countyFips':countyFips, 'lat':lat, 'lng':lng, 'beginDate':beginDate, 'endDate':endDate, 'year':year, 'injuries':injuries, 'deaths':deaths, 'damage':damage}
    newFrame = pd.DataFrame(newFrame)

    for row in rowsToDel:
        newFrame.drop(newFrame.index[row])

    newFrame.to_csv('compositeStorms.csv', sep=',', index=False)