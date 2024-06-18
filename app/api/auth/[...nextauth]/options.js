import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from 'mongoose';

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
    brandColor: "#2F2E2E", // Hex color code
    logo: "", // Absolute URL to image
    buttonText: "", // Hex color code
  },
  callbacks: {
    async signIn({ user, account, profile }) {
        // await clientPromise;
        await clientPromise; // Await the clientPromise to ensure the MongoClient connection is ready
        if (mongoose.connection.readyState === 0) {
          await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false
          });
        }
        const res = await User.findOneAndUpdate(
            { email: user.email },
            {isTeacher:determineIfTeacher(profile) || false},
        );
        console.log("res", res);
      return true;
    },
    async session({ session }) {
        const userProfile = await User.findOne({ email: session.user.email });
        session.user.isTeacher = userProfile.isTeacher;
        session.user._id = userProfile._id;
        return session;
    },
  },
};

function determineIfTeacher(profile) {
    const teacherEmails = ['gopikrishna6003@gmail.com']
    // const teacherEmails = ['abc@gmail.com']; 
    return teacherEmails.includes(profile.email)
  }

