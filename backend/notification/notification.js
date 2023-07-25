import Notification from "../models/notificationSchema"


export const sendNotification = async(from,to,message)=>{
    try {
        let notificationData = {
            to,
            from,
            message,
            time: new Date()
        }
        await Notification.create(notificationData).then((err)=>{
            if (!err) {
                return true;
            }
        })
    } catch (error) {
        console.log('Notification Error : ', error)
    }
}