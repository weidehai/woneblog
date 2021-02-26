let num = 10
let offset = 0
let end = false
let table = "articles"
let current_page = 1
let manager_loading = document.getElementsByClassName("myloading_1")[0]
let mood_submit = document.getElementById("mood_submit")
let mood_text = document.getElementById("mood_text")
let mood_tail = document.getElementById("mood_tail")
let mood_tail_text = document.getElementById("mood_tail_text")
let lable_list = document.getElementById("lable_list")
let lable = document.getElementById("lable")
let add_tag_btn = document.getElementById("add_tag")
let del_tag_btn = document.getElementById("del_tag")
let new_tag = document.getElementById("new_tag")
let new_tag_submit = document.getElementById("new_tag_submit")
let add_new_tag_wrapper = document.getElementById("add_new_tag_wrapper")
let hashcallback = true
let should_first_get = false
window.onhashchange = () => {
    if (!hashcallback) return
    console.log("docallback")
    if (window.location.hash === "") {
        history.back(-1)
    } else if (/articles|drafts/ig.test(window.location.hash)) {
        //table = window.location.hash.substring(1)
        SuspendedBtn.manage_navigate(window.location.hash.replace("#", ""))
        //sessionStorage.setItem(`manage_table`,`${table}`)
        //get_info()
    } else {
        SuspendedBtn.manage_navigate(window.location.hash.replace("#", ""))
    }
    control_from_browser = false
    SuspendedBtn.close_menu_force()
}

function change_hash_nocallback(hash) {
    hashcallback = false
    window.location.hash = hash
    setTimeout(() => {
        hashcallback = true
    }, 0)
}
window.onload = function() {
    SuspendedBtn.suspended()
    SuspendedBtn.register_menu()
    if (window.location.hash === "") {
        change_hash_nocallback(`${table}`)
        sessionStorage.setItem(`manage_table`, `${table}`)
        first_get()
        manager_loading.style.display = "block"
    } else if (/articles|drafts/ig.test(window.location.hash)) {
        table = window.location.hash.substring(1)
        sessionStorage.setItem(`manage_table`, `${table}`)
        auto_get()
    } else {
        SuspendedBtn.manage_navigate(window.location.hash.replace("#", ""))
        should_first_get = true
    }
    SuspendedBtn.close_menu_force()
    addevent()
}

function first_get() {
    manager_loading.style.display = 'block'
    Interactive.XHRApart(table, 'article_title,article_time,article_tag,post_key', 'article_time', offset, 10, (result) => {
        //sessionStorage.setItem(`${table}first`,1)
        render(result)
        manager_loading.style.display = 'none'
        if (result.length < 10) {
            end = true
            offset = 0
            console.log(offset, num)
            pagebtn_init()
            return
        }
        offset = offset + 10
        if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
            first_get()
            num = num + 10
            return
        }
        offset = 0
        console.log(offset, num)
        sessionStorage.setItem(`${table}current_page`, 1)
        sessionStorage.setItem(`${table}num`, num)
        pagebtn_init()
    })
}

function pagebtn_init() {
    let page = document.getElementById('page')
    let nav = page.querySelector("nav")
    let next_active = false
    let previous_active = false
    let pagebtn = []
    let page_active = null
    //let fragment = document.createDocumentFragment()
    let div_wrapper = document.createElement('nav')
    let next = document.getElementById('next_page')
    let previous = document.getElementById('previous_page')
    let total
    // num = parseInt(sessionStorage.getItem(`${table}num`)) || 10
    // current_page = parseInt(sessionStorage.getItem(`${table}current_page`)) || 1
    //offset = num*(current_page-1) || 0
    console.log(num, current_page, offset)
    if (nav) {
        page.removeChild(nav)
    }
    if (table === "articles") {
        total = page.getAttribute("data-article_total")
    } else {
        total = page.getAttribute("data-draft_total")
    }
    console.log(total)
    let page_num = Math.ceil(total / num)
    console.log(page_num)
    if (page_num <= 1) {
        page.style.display = "none"
        return
    }
    for (let i = 1; i <= page_num; i++) {
        let div = document.createElement('div')
        div.innerText = i
        div.style.display = 'inline-block'
        div_wrapper.appendChild(div)
        pagebtn.push(div)
    }
    page.insertBefore(div_wrapper, next)
    page.style.display = "flex"
    page_active = div_wrapper.querySelectorAll("div")[current_page - 1]
    page_active.style.backgroundColor = 'gray'
    check_whether_headortail()
    div_wrapper.addEventListener("click", (e) => {
        let want_page = parseInt(e.target.innerText)
        if (want_page === current_page) return
        page_active.style.backgroundColor = "#409eff"
        e.target.style.backgroundColor = 'gray'
        page_active = e.target
        current_page = want_page
        offset = (want_page - 1) * num
        manager_loading.style.display = 'block'
        get_info()
        if (current_page === 1) {
            is_head()
        }
        if (current_page === page_num) {
            is_tail()
        }
    })

    function next_page() {
        current_page++
        console.log(current_page, page_num)
        offset = offset + num
        get_info()
        page_active.style.backgroundColor = '#409eff'
        pagebtn[current_page - 1].style.backgroundColor = "gray"
        page_active = pagebtn[current_page - 1]
        is_tail()
    }

    function previous_page() {
        console.log(current_page)
        current_page--
        offset = offset - num
        get_info()
        page_active.style.backgroundColor = '#409eff'
        pagebtn[current_page - 1].style.backgroundColor = "gray"
        page_active = pagebtn[current_page - 1]
        is_head()
    }

    function is_head() {
        console.log("head")
        if (current_page === 1) {
            previous.onclick = null
            previous.style.backgroundColor = 'gray'
            previous_active = false
        }
        if (!next_active) {
            next.onclick = next_page
            next.style.backgroundColor = '#409eff'
            next_active = true
        }
    }

    function is_tail() {
        console.log("tail")
        console.log(current_page, page_num)
        if (current_page === page_num) {
            next.onclick = null
            next.style.backgroundColor = 'gray'
            next_active = false
        }
        if (!previous_active) {
            previous.onclick = previous_page
            previous.style.backgroundColor = "#409eff"
            previous_active = true
        }
    }

    function check_whether_headortail() {
        if (current_page === 1) {
            previous.onclick = null
            previous.style.backgroundColor = 'gray'
            previous_active = false
            next.onclick = next_page
            next.style.backgroundColor = '#409eff'
            next_active = true
        } else if (current_page === page_num) {
            next.onclick = null
            next.style.backgroundColor = 'gray'
            next_active = false
            previous.onclick = previous_page
            previous.style.backgroundColor = "#409eff"
            previous_active = true
        } else {
            next.onclick = next_page
            next.style.backgroundColor = '#409eff'
            next_active = true
            previous.onclick = previous_page
            previous.style.backgroundColor = "#409eff"
            previous_active = true
        }
    }
}

function render(result) {
    main = document.querySelector('main')
    for (let i = 0; i < result.length; i++) {
        let ul = document.createElement('ul')
        let li1 = document.createElement('li')
        let li2 = document.createElement('li')
        let li3 = document.createElement('li')
        let li4 = document.createElement('li')
        let bt1 = document.createElement('button')
        let bt2 = document.createElement('button')
        let text1 = document.createTextNode(result[i]['article_title'])
        let text2 = document.createTextNode(result[i]['article_tag'])
        let text3 = document.createTextNode(result[i]['article_time'])
        let text4 = document.createTextNode('编辑')
        let text5 = document.createTextNode('删除')
        li1.setAttribute('style', 'width:52%;')
        li2.setAttribute('style', 'width:16%;')
        li3.setAttribute('style', 'width:16%;')
        li4.setAttribute('style', 'width:16%;')
        bt1.addEventListener('click', () => {
            if (table === "articles") {
                window.location.href = `/publish?getid=${result[i]['post_key']}`
            } else {
                window.location.href = `/publish?draftid=${result[i]['post_key']}`
            }
        })
        bt2.addEventListener('click', () => {
            dialog = window.confirm(`您确定要删除 ${result[i]['article_title']} 这篇文章？`)
            if (dialog) {
                Interactive.XHRDel(table, result[i]['post_key'], () => {
                    if (table === "articles") {
                        let xhr = Interactive.creatXHR()
                        xhr.open("GET", `/updatearticlenum?tag_name=${result[i]['article_tag']}&operation=sub`, true)
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4) {
                                if (xhr.responseText === "success") {
                                    Interactive.XHRDelFile(JSON.stringify({
                                        'filelist': `static\\upload\\${result[i]['post_key']}`
                                    }), "dir", () => {
                                        main.removeChild(bt2.parentElement.parentElement)
                                    })
                                }
                            }
                        }
                        xhr.send(null)
                    } else {
                        Interactive.XHRDelFile(JSON.stringify({
                            'filelist': `static\\draft\\${result[i]['post_key']}`
                        }), "dir", () => {
                            main.removeChild(bt2.parentElement.parentElement)
                        })
                    }
                })
            }
        })
        ul.appendChild(li1)
        ul.appendChild(li2)
        ul.appendChild(li3)
        ul.appendChild(li4)
        li1.appendChild(text1)
        li2.appendChild(text2)
        li3.appendChild(text3)
        li4.appendChild(bt1)
        li4.appendChild(bt2)
        bt1.appendChild(text4)
        bt2.appendChild(text5)
        //这里可以使用document.createDocumentFragment()来创建一个文档片段。先将节点放在文档片段中在统一渲染，避免直接插入dom造成多次渲染
        main.appendChild(ul)
    }
}

function get_info() {
    manager_loading.style.display = 'block'
    Interactive.XHRApart(table, 'article_title,article_time,article_tag,post_key', 'article_time', offset, num, (result) => {
        document.querySelector('main').innerHTML = ""
        render(result)
        sessionStorage.setItem(`${table}current_page`, current_page)
        sessionStorage.setItem(`${table}offset`, offset)
        sessionStorage.setItem(`${table}num`, num)
        manager_loading.style.display = "none"
        //console.log(result.length,offset,num)
        if (result.length < num) {
            end = true
            return
        }
    })
}

function addevent(argument) {
    mood_submit.addEventListener("click", () => {
        let data = {
            "table": 'admin',
            "mood": mood_text.value,
            "post_key": 1
        }
        mood_update(data, mood_text)
    })
    mood_tail.addEventListener("click", () => {
        let data = {
            "table": 'admin',
            "mood_tail": mood_tail_text.value,
            "post_key": 1
        }
        mood_update(data, mood_tail_text)
    })
    lable_list.addEventListener('change', function() {
        console.log(this)
        lable.innerText = this.options[this.options.selectedIndex].value
    })
    add_tag_btn.addEventListener("click", () => {
        add_new_tag_wrapper.style.display = 'flex'
    })
    new_tag_submit.addEventListener("click", () => {
        let data = {
            "table": 'blogtags',
            "tag_name": new_tag.value
        }
        add_tag(data, new_tag)
    })
    del_tag_btn.addEventListener("click", () => {
        if (parseInt(lable_list.selectedOptions[0].getAttribute('data-total'))) {
            alert("该标签文章数不为0，无法删除！！！")
        } else {
            let id = lable_list.selectedOptions[0].innerText
            del_tag(id)
        }
    })
}

function mood_update(mood, el) {
    Interactive.XHRUpdate(mood, (r) => {
        el.value = ""
    })
}

function add_tag(data, el) {
    Interactive.XHRSave(data, "post", () => {
        el.value = ""
        let option = document.createElement("option")
        option.innerText = data["tag_name"]
        lable_list.appendChild(option)
        option.selected = true
        lable.innerText = data["tag_name"]
    })
}

function del_tag(id) {
    Interactive.XHRDel("blogtags", id, () => {
        console.log(lable_list.options)
        previous_index = lable_list.options.selectedIndex - 1
        lable_list.removeChild(lable_list.selectedOptions[0])
        lable_list.options[previous_index].selected = true
        lable.innerText = lable_list.options[previous_index].value
    })
}

function state_pop() {
    let sessionitem_num = sessionStorage.getItem(`${table}num`)
    let sessionitem_current_page = sessionStorage.getItem(`${table}current_page`)
    num = parseInt(sessionitem_num) || 10
    current_page = parseInt(sessionitem_current_page) || 1
    offset = num * (current_page - 1) || 0
    return !!sessionitem_num && !!sessionitem_current_page
}

function auto_get() {
    if (state_pop()) {
        pagebtn_init()
        get_info()
    } else {
        first_get()
    }
}