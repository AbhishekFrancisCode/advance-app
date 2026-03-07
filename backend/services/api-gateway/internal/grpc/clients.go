package grpc

var UserSvc *UserClient
var AuthSvc *AuthClient

func InitClients() {
	UserSvc = NewUserClient()
	AuthSvc = NewAuthClient()
}
