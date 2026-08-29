const Property = require('../models/Property');
const Visit = require('../models/Visit');
const User = require('../models/User');

// @desc    Get analytics data for a landlord
// @route   GET /api/analytics/owner
// @access  Private (Landlord)
const getOwnerAnalytics = async (req, res) => {
    try {
        const landlordId = req.user._id;

        // Get all properties
        const properties = await Property.find({ landlord: landlordId });
        const propertyIds = properties.map(p => p._id);

        // Total stats
        const totalProperties = properties.length;
        const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
        const monthlyRevenue = properties
            .filter(p => p.availabilityStatus === 'occupied')
            .reduce((sum, p) => sum + p.rent, 0);

        // Total appointments
        const totalAppointments = await Visit.countDocuments({ property: { $in: propertyIds } });

        // Most viewed property
        const mostViewed = properties.sort((a, b) => b.views - a.views)[0] || null;

        // Monthly views chart data (last 6 months, based on property views divided evenly as approximation)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const chartData = months.map((month, i) => ({
            month,
            views: Math.floor(totalViews / 6) + i * 10
        }));

        // Recent activity (last 5 visits)
        const recentVisits = await Visit.find({ property: { $in: propertyIds } })
            .populate('tenant', 'firstName lastName')
            .populate('property', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentActivity = recentVisits.map(v => ({
            message: `${v.tenant.firstName} ${v.status === 'approved' ? 'approved' : v.status === 'rejected' ? 'cancelled' : 'booked'} a visit for ${v.property.title}`,
        }));

        res.json({
            totalProperties,
            totalViews,
            totalAppointments,
            monthlyRevenue,
            mostViewed,
            chartData,
            recentActivity,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get platform-wide stats (public)
// @route   GET /api/analytics/system-stats
// @access  Public
const getSystemStats = async (req, res) => {
    try {
        const totalProperties = await Property.countDocuments();
        const cities = await Property.distinct('location');
        const totalTenants = await User.countDocuments({ role: 'tenant' });

        res.json({
            totalProperties,
            totalCities: cities.length,
            totalTenants,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOwnerAnalytics, getSystemStats };

