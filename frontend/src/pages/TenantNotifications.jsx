import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/tenantNotifications.css";

function OwnerNotifications(){

const notifications=[

{
icon:"📅",
title:"New Appointment",
message:"Rahul Sharma booked a visit.",
time:"2 minutes ago"
},

{
icon:"💬",
title:"New Message",
message:"Sneha Das sent you a message.",
time:"15 minutes ago"
},

{
icon:"🏠",
title:"Property Approved",
message:"Luxury Apartment is now live.",
time:"Yesterday"
},

{
icon:"👁",
title:"Property Viewed",
message:"Your property was viewed 23 times today.",
time:"Yesterday"
},

{
icon:"❌",
title:"Appointment Cancelled",
message:"Amit Kumar cancelled tomorrow's visit.",
time:"2 days ago"
}

];

return(

<div className="tenant-notifications-page">

<Navbar/>

<div className="notifications-container">

<h1>Notifications</h1>

{

notifications.map((item,index)=>(

<div
key={index}
className="notification-card"
>

<div className="notification-icon">

{item.icon}

</div>

<div className="notification-content">

<h3>{item.title}</h3>

<p>{item.message}</p>

<span>{item.time}</span>

</div>

</div>

))

}

</div>

<Footer/>

</div>

);

}

export default OwnerNotifications;