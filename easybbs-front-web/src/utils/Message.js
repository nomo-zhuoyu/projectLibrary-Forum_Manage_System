import {ElMessage} from 'element-plus'
// import {de} from 'element-plus/es/locale'

const showMessage = (msg,callback,type) => {
    ElMessage({
        type:type,
        message:msg,
        duration:2000,
        onClose: () => {
            if(callback){
                callback();
            }
        }
    })
}


const message = {
    error:(msg,callback) => {
        showMessage(msg,callback,"error")
    },
    success:(msg,callback) => {
        showMessage(msg,callback,"success")
    },
    warning:(msg,callback) => {
        showMessage(msg,callback,"warning")
    },
}

// 如果没有这个，import会失败
export default message;