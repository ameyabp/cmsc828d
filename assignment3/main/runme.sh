# connect to the psql database and run the file 'populateDB.sql'
psql -U a3user -d a3db -f populateDB.sql

# install the dependencies
pip install -r requirements.txt 

# start the server
python3 serverApp.py