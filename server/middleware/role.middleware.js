export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - Please login first", success: false });
        }

        const userRole = req.user.role === "user" ? "patient" : req.user.role;
        const normalizedAllowedRoles = allowedRoles.map((r) => (r === "user" ? "patient" : r));

        if (!normalizedAllowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: `Access denied: Requires one of roles: [${normalizedAllowedRoles.join(", ")}], but logged in as: ${userRole}`,
                success: false,
                requiredRoles: normalizedAllowedRoles,
                currentRole: userRole,
            });
        }
        next();
    };
};