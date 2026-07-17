import OwnerNavbar from "../components/OwnerNavbar";
import Footer from "../components/Footer";
import "../styles/ownerAnalytics.css";

import {

LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid

} from "recharts";

const data=[

{month:"Jan",views:120},
{month:"Feb",views:180},
{month:"Mar",views:240},
{month:"Apr",views:300},
{month:"May",views:410},
{month:"Jun",views:520}

];

function OwnerAnalytics(){

return(

<div className="analytics-page">

<OwnerNavbar/>

<div className="analytics-container">

<h1>Analytics Dashboard</h1>

<div className="analytics-cards">

<div className="analytics-card">

<h2>1</h2>

<p>Total Properties</p>

</div>

<div className="analytics-card">

<h2>100</h2>

<p>Total Views</p>

</div>

<div className="analytics-card">

<h2>12</h2>

<p>Appointments</p>

</div>

<div className="analytics-card">

<h2>₹85,000</h2>

<p>Monthly Revenue</p>

</div>

</div>

<div className="chart-card">

<h2>Monthly Property Views</h2>

<ResponsiveContainer width="100%" height={350}>

<LineChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line

type="monotone"

dataKey="views"

stroke="#2563eb"

strokeWidth={4}

/>

</LineChart>

</ResponsiveContainer>

</div>

<div className="bottom-grid">

<div className="top-property">

<h2>Most Viewed Property</h2>

<img

src="/houses/WhatsApp Image 2026-06-30 at 10.55.17 AM.jpeg"

alt="House"

/>

<h3>Luxury Apartment</h3>

<p>👁 520 Views</p>

<p>📅 14 Visits</p>

</div>

<div className="recent-activity">

<h2>Recent Activities</h2>

<ul>

<li>✔ Rahul booked a visit</li>

<li>✔ Sneha cancelled appointment</li>

<li>✔ Apartment viewed 18 times</li>

<li>✔ New tenant message</li>

<li>✔ Property added successfully</li>

</ul>

</div>

</div>

</div>

<Footer/>

</div>

);

}

export default OwnerAnalytics;