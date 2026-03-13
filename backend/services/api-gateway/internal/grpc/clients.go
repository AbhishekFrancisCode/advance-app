package grpc

var UserSvc *UserClient
var AuthSvc *AuthClient
var NotifySvc *NotificationClient

func InitClients() {
	UserSvc = NewUserClient()
	AuthSvc = NewAuthClient()
	NotifySvc = NewNotificationClient()
}
