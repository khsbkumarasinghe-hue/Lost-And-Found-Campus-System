const API_URL = "/api/campus-locations";


// Load locations when page opens
window.onload = function () {
    loadLocations();
};


// Get all locations
function loadLocations() {

    fetch(API_URL)

        .then(response => response.json())

        .then(data => {

            let table = document.getElementById("locationTable");

            table.innerHTML = "";


            data.forEach(location => {

                table.innerHTML += `

                <tr>

                    <td>${location.id}</td>

                    <td>${location.name}</td>

                    <td>

                        <button onclick="editLocation(${location.id}, '${location.name}')">
                            Edit
                        </button>


                        <button onclick="deleteLocation(${location.id})">
                            Delete
                        </button>

                    </td>

                </tr>

                `;

            });


        })

        .catch(error => console.log(error));

}





// Add location

function addLocation() {


    let name = document.getElementById("locationName").value;


    if(name === ""){

        alert("Enter Location Name");
        return;

    }


    fetch(API_URL, {


        method:"POST",


        headers:{
            "Content-Type":"application/json"
        },


        body:JSON.stringify({

            name:name

        })


    })


        .then(response=>response.json())


        .then(()=>{


            alert("Location Added");


            clearForm();


            loadLocations();


        });


}







// Edit location

function editLocation(id,name){


    document.getElementById("locationId").value = id;


    document.getElementById("locationName").value = name;


}








// Update location

function updateLocation(){


    let id = document.getElementById("locationId").value;


    let name = document.getElementById("locationName").value;



    if(id===""){


        alert("Select location first");


        return;

    }




    fetch(API_URL+"/"+id,{


        method:"PUT",


        headers:{


            "Content-Type":"application/json"


        },


        body:JSON.stringify({


            id:id,


            name:name


        })


    })



        .then(response=>response.json())



        .then(()=>{


            alert("Location Updated");


            clearForm();


            loadLocations();


        });



}







// Delete location

function deleteLocation(id){


    if(confirm("Delete this location?")){


        fetch(API_URL+"/"+id,{


            method:"DELETE"


        })



            .then(()=>{


                alert("Deleted");


                loadLocations();


            });


    }


}







// Clear form

function clearForm(){


    document.getElementById("locationId").value="";


    document.getElementById("locationName").value="";


}
