import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

function PropertyMap({ lat, lng }) {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    if (!isLoaded) return <p>Loading Map...</p>;

    return (

        <GoogleMap
            zoom={15}
            center={{ lat, lng }}
            mapContainerStyle={{
                width: "100%",
                height: "400px",
                borderRadius: "15px"
            }}
        >

            <Marker position={{ lat, lng }} />

        </GoogleMap>

    );

}

export default PropertyMap;