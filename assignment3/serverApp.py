from flask import Flask, request, render_template, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import json

cursorMap = None
cursorBar = None

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
        cursorMap.execute(f'select stateFips, count(*) as value from storms where state is not null and year between {beginYear} and {endYear} group by stateFips;')
        mapData = json.dumps(cursorMap.fetchall())
        #print("getMap called")
        #print(mapData)
    else:
        print(request.method)

    return mapData

@app.route('/getBars', methods=['GET', 'POST'])
def getBars():
    if request.method == 'POST':
        newRange = json.loads(request.data)
        stateFips = int(newRange["stateFips"].lstrip('0'))
        beginYear = newRange["start"]
        endYear = newRange["end"]
        choice = newRange["radio"]
        if choice == 'instances':
            cursorBar.execute(f"select eventType, count(*) as value from storms where stateFips={stateFips} and year between {beginYear} and {endYear} group by eventType;")
        else:
            cursorBar.execute(f"select eventType, sum({choice}) as value from storms where stateFips={stateFips} and year between {beginYear} and {endYear} group by eventType;")
        barData = json.dumps(cursorBar.fetchall())
        #print("getBars called")
        #print(barData)
    else:
        print(request.method)

    return barData

if __name__ == '__main__':
    conn = psycopg2.connect("dbname=a3db user=a3user password=password")
    cursorMap = conn.cursor(cursor_factory=RealDictCursor)
    cursorBar = conn.cursor(cursor_factory=RealDictCursor)
    print("Connected to psql a3db")
    
    # start this web server
    app.run(host='127.0.0.1', port=8080, debug=False)

    cursorMap.close()
    cursorBar.close()
    conn.close()