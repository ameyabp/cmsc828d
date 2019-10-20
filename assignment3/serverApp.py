from flask import Flask, request, render_template, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import json

cursor = None

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/', methods=['GET'])
def index():
    return render_template('base.html')

@app.route('/getMap', methods=['GET', 'POST'])
def getMap():
    if request.method == 'POST':
        newRange = json.loads(request.data)
        beginYear = newRange["start"]
        endYear = newRange["end"]
        cursor.execute(f'select stateFips, count(*) as value from storms where state is not null and year between {beginYear} and {endYear} group by stateFips;')
        mapData = json.dumps(cursor.fetchall())
        #print("getMap called")
        #print(mapData)
    else:
        print(request.method)

    return mapData

@app.route('/getBars', methods=['GET', 'POST'])
def getBars():
    if request.method == 'POST':
        newRange = json.loads(request.data)
        stateFips = newRange["stateFips"]
        #print("range received:", beginYear, endYear)
        cursor.execute(f"select year, count(*) as value from storms where statefips=\'{stateFips}\' group by year;")
        #cursor.execute(f"select state, count(*) as value from storms where year between {beginYear} and {endYear} group by state order by value desc;")
        # state like \'%Y%\' and 
        barData = json.dumps(cursor.fetchall())
        print("getBars called")
        print(barData)
    else:
        print(request.method)

    return barData

if __name__ == '__main__':
    conn = psycopg2.connect("dbname=a3db user=a3user password=password")
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    print("Connected to psql a3db")
    
    # start this web server
    app.run(host='127.0.0.1', port=8080, debug=False)

    cursor.close()
    conn.close()