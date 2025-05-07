package main

import (
	"example/web-service-gin/api"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/jmoiron/sqlx"
)

const uploadDir = "./static/"

var db *sqlx.DB

type album struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

type testObjectResponse struct {
	ID     int    `json:"id"`
	Name   string `json:"image"`
	Number int    `json:"number"`
}

func (t *testObjectResponse) convertImage() {
	t.Name = GetFileURL(t.Name)
}

var albums = []album{
	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

func initDB() {
	var err error
	connStr := "host=localhost port=5432 user=postgres dbname=boat_tent sslmode=disable password=074546"
	db, err = sqlx.Connect("pgx", connStr)
	if err != nil {
		panic("DB error")
	}
}

func main() {
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, os.ModePerm)
	}

	initDB()

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	router.Static("/uploads", uploadDir)
	router.GET("/albums", getAlbums)
	router.GET("/test", getTest)
	router.GET("/categories", api.Categories)
	router.GET("/items", api.Items)
	router.GET("/item", api.Item)
	router.POST("/checkUser", api.CheckUser)
	router.POST("/createUser", api.CreateUser)
	router.GET("/userByToken", api.UserByToken)
	router.POST("/updateUser", api.UpdateUser)
	router.GET("/userOrders", api.UserOrders)
	router.POST("/createOrder", api.CreateOrder)

	router.Run("localhost:8080")
}

func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}

func getTest(c *gin.Context) {
	var testObjects []testObjectResponse
	err := db.Select(&testObjects, "SELECT * FROM test_table")

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	for i := 0; i < len(testObjects); i++ {
		testObjects[i].convertImage()
	}

	c.JSON(200, testObjects)
}

func GetFileURL(name string) string {
	const baseURL = "http://localhost:8080/uploads/"

	path := uploadDir + name
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return ""
	}

	return baseURL + name
}
