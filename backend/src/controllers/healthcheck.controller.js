import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiRespone.js";

// GET /api/v1/healthcheck
const healthcheck = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, { status: "OK" }, "Server is running"));
});

export { healthcheck };
