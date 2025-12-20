import React from "react";

const VehiclePanel = (props) => {
    return (
        <div>
            <h5
                className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => {props.setVehiclePanel(false)}}
            >
                <i className=" text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className="text-2xl font-semibold mb-5">Choose a vehicle</h3>

            <div
                onClick={() => {
                    props.setConfirmRidePanel(true);
                }}
                className="flex border-2 border-gray-200 
           active:border-black  mb-2 rounded-xl items-center justify-between p-3"
            >
                <img
                    className="h-10"
                    src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png"
                />
                <div className=" ml-2 w-1/2">
                    <h4 className="font-medium text-lg">
                        UberGo
                        <span>
                            <i className="ri-user-3-fill"></i>4
                        </span>
                    </h4>
                    <h5 className="font-medium text-sm ">2 mins away</h5>
                    <p className="font-medium text-xs text-grap-600">
                        Affordable compact rides
                    </p>
                </div>
                <h2 className="text-lg font-semibold ">$193.30</h2>
            </div>
            <div
                onClick={() => {
                    props.setConfirmRidePanel(true);
                }}
                className="flex border-2 border-gray-200 
           active:border-black  mb-2 rounded-xl items-center justify-between p-3"
            >
                <img
                    className="h-10"
                    src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9mY2RkZWNhYS0yZWVlLTQ4ZmUtODdmMC02MTRhYTdjZWU3ZDMucG5n"
                />
                <div className="ml-2 w-1/2">
                    <h4 className="font-medium text-lg">
                        UberGo
                        <span>
                            <i className="ri-user-3-fill"></i>1
                        </span>
                    </h4>
                    <h5 className="font-medium text-sm ">8 mins away</h5>
                    <p className="font-medium text-xs text-grap-600">
                        Affordable motocycle rides
                    </p>
                </div>
                <h2 className="text-lg font-semibold ">$65.30</h2>
            </div>
            <div
                onClick={() => {
                    props.setConfirmRidePanel(true);
                }}
                className="flex border-2 border-gray-200 
           active:border-black  mb-2 rounded-xl items-center justify-between p-3"
            >
                <img
                    className="h-10"
                    src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n"
                />
                <div className="ml-2 w-1/2">
                    <h4 className="font-medium text-lg">
                        UberGo
                        <span>
                            <i className="ri-user-3-fill"></i>3
                        </span>
                    </h4>
                    <h5 className="font-medium text-sm ">4 mins away</h5>
                    <p className="font-medium text-xs text-grap-600">
                        Affordable, auto rides
                    </p>
                </div>
                <h2 className="text-lg font-semibold ">$89.30</h2>
            </div>
        </div>
    );
};

export default VehiclePanel;
