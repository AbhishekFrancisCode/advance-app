package db

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB() *gorm.DB {
	dsn := "host=postgres user=postgres password=postgres dbname=inventorydb port=5432 sslmode=disable"

	var db *gorm.DB
	var err error

	for i := 0; i < 10; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			fmt.Println("✅ Connected to DB")
			return db
		}

		log.Println("⏳ Waiting for DB...", err)
		time.Sleep(2 * time.Second)
	}

	log.Fatal("❌ Could not connect to DB after retries")
	return nil
}
