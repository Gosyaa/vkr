package repository

import (
	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/jmoiron/sqlx"
)

var connection *sqlx.DB

func initDB() {
	if connection != nil {
		return
	}
	var err error
	connStr := "host=localhost port=5432 user=postgres dbname=boat_tent sslmode=disable password=074546"
	connection, err = sqlx.Connect("pgx", connStr)
	if err != nil {
		panic("DB error")
	}
}
