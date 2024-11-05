// botton status 
const buttonStatus = document.querySelectorAll("[button-status]")
if (buttonStatus.length > 0){

    let url = new URL(window.location.href) // ham nay co the phan tich url
    
    buttonStatus.forEach(button => {
        button.addEventListener("click", ()=>{
            const status = button.getAttribute("button-status")

            if (status){
                url.searchParams.set("status", status)
            }
            else 
                url.searchParams.delete("status")
            // console.log(url.href)
            window.location.href = url.href
        })
    })
}

// end botton status 


// form search
const formSearch = document.querySelector("#form-search")
if (formSearch){
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e)=>{
        e.preventDefault(); // ngăn chặn mặc định của submit form là link sang trang mới
        const keyword = e.target.elements.keyword.value;
        if (keyword){
            url.searchParams.set("keyword", keyword)
        }
        else 
            url.searchParams.delete("keyword")

        window.location.href = url.href;
    })
}

// end form search


// pagination
    const buttonPagination = document.querySelectorAll("[button-pagination]")

    if (buttonPagination.length > 0){
        let url = new URL(window.location.href);

        buttonPagination.forEach(button => {
            button.addEventListener("click", ()=>{
                const page = button.getAttribute("button-pagination")

                url.searchParams.set("page",page)
                window.location.href = url.href
            })
        })
    }
    

// end pagination


// checkbox multi
    const checkboxMulti = document.querySelector("[checkbox-multi]")
    if (checkboxMulti){
        const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
        const inputIds = checkboxMulti.querySelectorAll("input[name='id']")

        inputCheckAll.addEventListener("click", ()=>{
            // biến checked để kiểm tra biến đã tick chưa
            if (inputCheckAll.checked){
                inputIds.forEach(input =>{
                    input.checked = true;
                })
            }
            else {
                inputIds.forEach(input =>{
                    input.checked = false;
                })
            }
        })

        inputIds.forEach(input => {
            input.addEventListener("click", () => {
                const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length
                if (countChecked == inputIds.length){
                    inputCheckAll.checked = true
                }
                else {
                    inputCheckAll.checked = false;
                }
            })
        })
    }

// end checkbox multi

// form change multi
    const formChangeMulti = document.querySelector("[form-change-multi]")
    if (formChangeMulti){
        formChangeMulti.addEventListener("submit", (e) => {
            e.preventDefault()
            const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")
            
            // check nếu hành động chọn là xóa tất cả thì in thông báo cho người dùng
            const typeChange = e.target.elements.type.value
            if (typeChange == "delete-all"){
                const isConfirm = confirm("Bạn có chắc sẽ xóa tất cả sản phẩm không?")
                if (isConfirm == false){
                    return
                }
            }

            if (inputsChecked.length > 0){
                const inputIds = formChangeMulti.querySelector("input[name='ids']") 
                let ids = []

                inputsChecked.forEach(input =>{
                    const id = input.getAttribute("value")
                    
                    if (typeChange == "change-position"){
                        // hàm .closest đi từ thẻ input ra thẻ cha là tr
                        const position = input.closest("tr").querySelector("input[name='position']").value
                        //console.log(`${id}-${position}`)

                        ids.push(`${id}-${position}`)

                    }
                    else {
                        ids.push(id)
                    }


                })
                //console.log(ids.join(", "))
                
                inputIds.value = ids.join(", ") // chuyen mang sang string
                formChangeMulti.submit()
            } 
            else{
                alert("Hãy chọn ít nhất 1 sản phẩm")
            }
        })
    }

// end form change multi


// delete item
    const buttonDelete = document.querySelectorAll("[button-delete]")
    const formDeleteItem = document.querySelector("#form-delete-item")
    if (buttonDelete.length > 0){
        const path = formDeleteItem.getAttribute("data-path")
        buttonDelete.forEach(button =>{
            button.addEventListener("click", () => {
                const isConfirm = confirm("Bạn có chắc sẽ xóa sản phẩm này?")
                if (isConfirm == true){
                    const id = button.getAttribute("data-id");
                    const action = path + `/${id}?_method=DELETE`
                    //console.log(action)
                    formDeleteItem.action = action
                    formDeleteItem.submit()
                }
            })
        })
    }

// end delete item

// xử lý thông báo
const showAlert = document.querySelector("[show-alert]")
if (showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closeAlert = showAlert.querySelector("[close-alert]")
    setTimeout(()=>{
        showAlert.classList.add("alert-hidden")
    }, time)
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
        
    })
}

// end show alert


// upload image
    const uploadImage = document.querySelector("[upload-image]")
    if (uploadImage){
        const uploadImageInput = document.querySelector("[upload-image-input]")
        const uploadImagePreview = document.querySelector("[upload-image-preview]")
        uploadImageInput.addEventListener("change", (e) => {
            console.log(e)
            const file = e.target.files[0]
            if (file){
                uploadImagePreview.src = URL.createObjectURL(file)
            }
        })        
    }

// end upload image