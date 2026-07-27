const API_URL = "http://localhost:8080/api/notifications";

document.addEventListener("DOMContentLoaded", fetchNotifications);

function fetchNotifications(){

    fetch(API_URL)

        .then(response => response.json())

        .then(data=>{

            const list=document.getElementById("notifList");

            list.innerHTML="";

            data.forEach(notification=>{

                const status=notification.read
                    ? "(Read)"
                    : "(Unread)";

                list.innerHTML +=`

            <li>

            ${notification.message}

            <strong>${status}</strong>

            ${
                    !notification.read ?

                        `<button onclick="markAsRead(${notification.id})">

                Mark As Read

                </button>`

                        :

                        ""
                }

            <button onclick="deleteNotification(${notification.id})">

            Delete

            </button>

            </li>

            `;

            });

        });

}

function createNotification(){

    const message=document.getElementById("notifMessage");

    if(message.value===""){

        alert("Enter Notification");

        return;
    }

    fetch(API_URL,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            message:message.value

        })

    })

        .then(()=>{

            message.value="";

            fetchNotifications();

        });

}

function markAsRead(id){

    fetch(API_URL+"/"+id+"/read",{

        method:"PUT"

    })

        .then(()=>fetchNotifications());

}

function deleteNotification(id){

    if(confirm("Delete Notification?")){

        fetch(API_URL+"/"+id,{

            method:"DELETE"

        })

            .then(()=>fetchNotifications());

    }

}