// [PATCH] change-status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if (buttonChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("#form-change-status")
    const path = formChangeStatus.getAttribute("data-path")

    buttonChangeStatus.forEach(button =>{
        button.addEventListener("click",() =>{
            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")
            
            let changeStatus = (statusCurrent == "active") ? "inactive" : "active"
            
            // console.log(statusCurrent)
            // console.log(id)
            // console.log(changeStatus)

            const action = path + `/${changeStatus}/${id}?_method=PATCH`
            formChangeStatus.action = action // gán lại action cho form
            formChangeStatus.submit()
        })
    })
}

// end change-status


