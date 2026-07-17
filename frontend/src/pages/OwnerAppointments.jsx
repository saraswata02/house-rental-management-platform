import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import "../styles/ownerAppointments.css";
import { useNavigate } from "react-router-dom";

function OwnerAppointments() {
  const navigate = useNavigate();

const appointments = [

{
id:1,
tenant:"Rahul Sharma",
property:"Luxury Apartment",
date:"18 July 2026",
time:"11:00 AM",
status:"Pending"
},

{
id:2,
tenant:"Aman Kumar",
property:"Green Villa",
date:"20 July 2026",
time:"03:00 PM",
status:"Approved"
},

{
id:3,
tenant:"Sneha Das",
property:"City Residency",
date:"22 July 2026",
time:"09:30 AM",
status:"Rejected"
}

];

return(

<div className="owner-appointments-page">

<OwnerNavbar/>

<div className="owner-appointments-container">

<h1>Appointment Requests</h1>

<div className="appointments-list">

{appointments.map((item)=>(

<div className="appointment-card" key={item.id}>

<div className="appointment-info">

<h2>{item.tenant}</h2>

<p>🏠 {item.property}</p>

<p>📅 {item.date}</p>

<p>🕒 {item.time}</p>

<span className={`status ${item.status.toLowerCase()}`}>
{item.status}
</span>

</div>

<div className="appointment-actions">

<button className="view-btn"
onClick={()=>navigate("/appointment-details")}>
View Details
</button>

<button className="approve-btn">
Approve
</button>

<button className="reject-btn">
Reject
</button>

</div>

</div>

))}

</div>

</div>

<Footer/>

</div>

);

}

export default OwnerAppointments;