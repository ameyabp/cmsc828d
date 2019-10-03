import pandas as pd
import os

if __name__ == '__main__':
	cwd = os.getcwd()
	csvFiles = [f for f in os.listdir(cwd) if '.csv' in f]

	db = []
	for file in csvFiles:
		print("reading file", file)
		df = pd.read_csv(file)
		db.append(df)

	frame = pd.concat(db, axis=0, ignore_index=True)
	print(frame.shape)