import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Check if required fields are provided
  if (
    [fullName, email, username, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user with the same username or email already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Ensure avatar file is provided
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload avatar to Cloudinary
  const avatarUploadResult = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUploadResult || !avatarUploadResult.url) {
    throw new ApiError(400, "Failed to upload avatar");
  }

  // Optionally handle cover image upload (if applicable)
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  let coverImageUrl = "";
  if (coverImageLocalPath) {
    const coverImageUploadResult =
      await uploadOnCloudinary(coverImageLocalPath);
    if (coverImageUploadResult && coverImageUploadResult.url) {
      coverImageUrl = coverImageUploadResult.url;
    } else {
      // Handle cover image upload failure (optional)
      // You can throw an error or log a warning
      console.log("Failed to upload cover image");
    }
  }

  // Create the user in the database
  const user = await User.create({
    fullName,
    avatar: avatarUploadResult.url,
    coverImage: coverImageUrl,
    email,
    password,
    username: username.toLowerCase(),
  });

  // Retrieve the created user data (excluding sensitive fields)
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Failed to register user");
  }

  // Return success response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Successfully registered"));
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  return res.json(users);
});

export { registerUser };
export { getUsers };
