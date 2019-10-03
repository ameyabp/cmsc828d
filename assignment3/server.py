import psycopg2
from config import Config

if __name__ == '__main__':
    commands = [
    """
    CREATE TABLE Flights (
        fid             int,
        month_id        int,
        day_of_month    int,
        day_of_week_id  int,
        carrier_id      varchar(7),
        flight_num      int,
        origin_city     varchar(34),
        origin_state    varchar(47),
        dest_city       varchar(34),
        dest_state      varchar(47),
        departure_delay int,
        taxi_out        int,
        arrival_delay   int,
        cancelled       int,
        actual_time     int,
        distance        int,
        capacity        int,
        price           int
    )
    """,
    """
    CREATE TABLE Carriers (
        cid             varchar(7),
        name            varchar(83)
    )
    """,
    """
    CREATE TABLE Months (
       mid             int,
        month           varchar(9)
    )
    """,
    """
    CREATE TABLE Weekdays (
        did             int,
        day_of_week     varchar(9)
    )
    """ ]

    params = Config()

    conn = psycopg2.connect(**params)

    cursor = conn.cursor()
    for cmd in commands:
        cursor.execute(cmd)
        conn.commit()

    cursor.execute("INSERT INTO Carriers (cid, name) VALUES (-1, 'my carrier')")
    conn.commit()
    cursor.execute("SELECT * FROM Carriers")
    for row in cursor:
        print(row)

    cursor.close()

    conn.close()