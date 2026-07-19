// ================================
// LocationManager.js
// ================================


export class LocationManager {


    constructor(){

        this.userLocation = null;

        this.isInsideWorkArea = false;

        this.currentLocationName = "";

        this.assignedWorkLocation = null;
        this.watchId = null;


        this.allLocations = [

            {
                name:"Head Office",
                latitude:24.6995139,
                longitude:46.7029137,
                radius:200
            },


            {
                name:"DGDA-Infra A",
                latitude:24.7117334,
                longitude:46.5807461,
                radius:500
            },


            {
                name:"DGDA-pendry SuperBlock",
                latitude:24.724643,
                longitude:46.587196,
                radius:500
            },


            {
                name:"DGDA-Ritz Carlton",
                latitude:24.729880,
                longitude:46.582786,
                radius:500
            },


            {
                name:"Misk City-Al Mishraq",
                latitude:24.6971404,
                longitude:46.5789578,
                radius:500
            },


            {
                name:"Misk City-Art Institute",
                latitude:24.6971404,
                longitude:46.5789578,
                radius:500
            }

        ];


    }



    // تحديد موقع المتدرب

    setAssignedLocation(name){


        const location =
        this.allLocations.find(
            x =>
            x.name.toLowerCase()
            ===
            name.toLowerCase()
        );


        if(location){

            this.assignedWorkLocation = location;

            this.currentLocationName =
            location.name;

        }
        else{

            console.log(
                "Location not found:",
                name
            );


        }


    }





    // تشغيل GPS

  startLocationUpdates(){

    return new Promise((resolve,reject)=>{

        if(!navigator.geolocation){

            reject("GPS not supported");
            return;

        }

        // إذا المراقبة بدأت قبل لا نعيد طلب الموقع
        if(this.watchId !== null){

            this.checkDistance();
            resolve(this.isInsideWorkArea);
            return;

        }

        this.watchId = navigator.geolocation.watchPosition(

            position=>{

                this.userLocation = {

                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude

                };

                this.checkDistance();

                resolve(this.isInsideWorkArea);

            },

            error=>{

                reject(error);

            },

            {

                enableHighAccuracy:true,
                maximumAge:5000

            }

        );

    });

}



    // حساب المسافة

    checkDistance(){


        if(
            !this.userLocation ||
            !this.assignedWorkLocation
        ){

            return;

        }



        const distance =
        this.calculateDistance(

            this.userLocation.latitude,

            this.userLocation.longitude,

            this.assignedWorkLocation.latitude,

            this.assignedWorkLocation.longitude

        );



        this.isInsideWorkArea =
        distance <=
        this.assignedWorkLocation.radius;



        console.log(
            "Distance:",
            distance,
            "meters"
        );


    }





    // Haversine Formula

    calculateDistance(
        lat1,
        lon1,
        lat2,
        lon2
    ){


        const R = 6371000;


        const dLat =
        (lat2-lat1)
        *
        Math.PI/180;


        const dLon =
        (lon2-lon1)
        *
        Math.PI/180;



        const a =

        Math.sin(dLat/2) *
        Math.sin(dLat/2)
        

        +

        Math.cos(lat1*Math.PI/180)

        *
        Math.cos(lat2*Math.PI/180)

        *

        Math.sin(dLon/2)
        *
        Math.sin(dLon/2);



        const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1-a)
        );



        return R*c;


    }


}