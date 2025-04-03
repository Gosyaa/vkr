package common

import "os"

func GetFileURL(name string) string {
	const baseURL = "http://localhost:8080/uploads/"
	const uploadDir = "./static/"

	path := uploadDir + name
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return ""
	}

	return baseURL + name
}
