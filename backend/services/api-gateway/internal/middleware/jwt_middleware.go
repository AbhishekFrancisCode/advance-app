package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Secret key used to verify the JWT signature
// This must be the same key used by Auth Service to create the token
var jwtSecret = []byte("super-secret-key")

func JWTMiddleware() gin.HandlerFunc {
	var tokenString string
	return func(c *gin.Context) {

		// STEP 1: Read Authorization header from the request
		// Example header:
		// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
		cookieToken, err := c.Cookie("accessToken")
		if err == nil && cookieToken != "" {
			tokenString = cookieToken
		} else {
			// 🔁 2. Fallback to Authorization header (OLD support)
			authHeader := c.GetHeader("Authorization")
			// VALIDATION 1:
			// If the header is missing, the user is not authenticated
			if authHeader == "" {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"error": "Authorization header missing",
				})
				return
			}
			// STEP 2: Split the header
			// Expected format: "Bearer TOKEN"
			parts := strings.Split(authHeader, " ")

			// VALIDATION 2:
			// Check if header format is correct
			if len(parts) != 2 {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"error": "Invalid Authorization format",
				})
				return
			}
			// Extract the token string
			tokenString = parts[1]
		}
		c.Request.Header.Set("Authorization", "Bearer "+tokenString)
		// STEP 3: Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

			// VALIDATION 3:
			// Ensure the token was signed using the expected algorithm
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}

			// Return the secret key used to verify the signature
			return jwtSecret, nil
		})

		// VALIDATION 4:
		// Check if token parsing failed OR token signature is invalid
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token",
			})
			return
		}

		// STEP 4: Extract the claims (payload inside JWT)
		claims := token.Claims.(jwt.MapClaims)
		// fmt.Println("claims", claims)
		// Example JWT payload:
		// {
		//   "user_id": "123",
		//   "email": "francis@email.com",
		//   "exp": 1710000000
		// }

		// VALIDATION 5:
		// Ensure user_id exists in the token payload
		userID, ok := claims["sub"].(string)
		// fmt.Println("sub", userID)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token payload",
			})
			return
		}

		// STEP 5: Store authenticated user identity in request context
		// This allows handlers to access the logged-in user
		c.Set("user_id", userID)
		c.Set("role", claims["role"].(string))
		// STEP 6: Allow request to continue to the handler
		c.Next()
	}
}
