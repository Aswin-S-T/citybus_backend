const Notification = require("../models/notificationSchema")


module.exports = {
    getNotification : (userId)=>{
        return new Promise(async(resolve,reject)=>{
            await Notification.find({to : userId}).then((result)=>{
                let notifications = []
                if (err) {
                    notifications = result
                }
                resolve(notifications)
            })
        })
    }
}