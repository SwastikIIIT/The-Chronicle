"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Clock,
  UserCircle,
  Calendar,
  Mail,
  Key,
  Shield,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { fetchUserInfo } from "@/server/api";
import {
  calculateAccountAge,
  formatDate,
  formatDateTime,
  timeAgo,
} from "@/lib/utils";
import { Laptop2 } from "lucide-react";
import SecurityHealth from "./CircularProgress";
import LoginActivityGraph from "./Graph";

const Dashboard = ({ session }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const result = await fetchUserInfo();
        if (result?.error) throw new Error(result?.error);
        toast.success("Success", { description: result.message });
        setUserInfo(result.userData);
        console.log("Data:", result.userData);
      } catch (err) {
        console.log(err);
        toast.error("Loading unsuccessful", {
          description: err?.message || "Failed to load user data",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [session]);

 const lastDeviceInfo = (loginHistory) => {
    const recentLogin = loginHistory[loginHistory.length - 1];
    return `${recentLogin.device} from ${recentLogin.location.region},${recentLogin.location.country}`;
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour <= 18)
      return [`Good Afternoon`, `${userInfo?.username}`];
    if (hour > 18 && hour <= 24)
      return [`Good Evening`, `${userInfo?.username}`];
    if (hour >= 0) return [`Good Morning`, `${userInfo?.username}`];
  };

  const calculateSecurityScore = (userInfo) => {
    if (!userInfo) return 0;
    let score = 0;
    if (userInfo?.isVerified) score += 20;
    if (userInfo?.twoFactor?.enabled) score += 40;
    if (calculateAccountAge(userInfo?.passwordLastChanged) < 90) score += 20;
    const recentFailures = userInfo?.loginHistory
      ?.slice(0, 5)
      .filter((v) => !v.success).length;
    if (recentFailures === 0) score += 20;

    return score;
  };

  const getSecurityLevel = (score) => {
    if (score >= 80)
      return {
        level: "Excellent",
        color: "green",
        description: "Your account security is excellent",
      };
    if (score >= 60)
      return {
        level: "Good",
        color: "blue",
        description: "Your account security is good",
      };
    if (score >= 40)
      return {
        level: "Fair",
        color: "yellow",
        description: "Consider improving your security",
      };
    return {
      level: "Poor",
      color: "red",
      description: "Immediate action required",
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center z-50">
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-purple-900/30 border-t-purple-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {/* Optional: Keep the text if you want, or remove it for total minimalism */}
        <p className="mt-4 text-purple-500/80 font-mono text-sm animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-16">
      <div className="relative z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 h-36 w-96 rounded-full bg-purple-600/40 opacity-70 blur-3xl" />
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto pt-12 px-4 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl text-white font-bold mb-8 border-b border-purple-900/40 pb-4">
          {greeting()[0]},{" "}
          <span className="text-purple-500">{greeting()[1]}</span>
        </h1>

        {/* UserCard */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="relative bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all overflow-hidden">
            <CardContent className="p-0">
              <div className=" overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/30 rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/20 rounded-full translate-x-6 translate-y-6 blur-xl" />

                <div className="relative z-10 p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 flex justify-center md:justify-start">
                      <div className="w-30 h-30 rounded-full bg-purple-900/20 border-2 border-purple-600/60 flex items-center justify-center overflow-hidden">
                        {userInfo?.image ? (
                          <img
                            src={userInfo?.image}
                            alt={`${userInfo.username || "User"}'s profile`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle size={80} className="text-purple-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-3 text-center md:text-left">
                        {userInfo?.username || "N/A"}
                      </h2>
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                        <Mail size={16} className="text-purple-500" />
                        <p className="text-gray-400">
                          {userInfo?.email || "N/A"}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-10 mt-4">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <Calendar
                            size={16}
                            className="text-purple-500 flex-shrink-0"
                          />
                          <span className="text-gray-300">Member since:</span>
                          <span className="text-white">
                            {formatDate(userInfo?.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <Key
                            size={16}
                            className="text-purple-500 flex-shrink-0"
                          />
                          <span className="text-gray-300">2FA Status:</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${userInfo?.twoFactor?.enabled ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                          >
                            {userInfo?.twoFactor?.enabled
                              ? "Enabled"
                              : "Disabled"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Account Stats Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all h-full">
              <CardHeader className="border-b border-purple-900/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock size={22} className="text-purple-500" />
                  <CardTitle className="mb-1 text-white">
                    Account Statistics
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                    <h3 className="text-gray-400 text-sm mb-1">Account Age</h3>
                    <p className="text-2xl font-bold text-white">
                      {calculateAccountAge(userInfo?.createdAt)} days
                    </p>
                  </div>

                  <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                    <h3 className="text-gray-400 text-sm mb-1">Last Login</h3>
                    <p className="text-md font-bold text-white">
                      {timeAgo(userInfo?.lastLogin)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">
                      Two-Factor Authentication
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${userInfo?.twoFactor?.enabled ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                    >
                      {userInfo?.twoFactor?.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Password Changed</span>
                    <span className="text-gray-400 text-sm">
                      {timeAgo(userInfo?.passwordLastChanged)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all h-full">
              <CardHeader className="border-b border-purple-900/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Activity size={22} className="text-purple-500" />
                  <div>
                    <CardTitle className="text-white">
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-gray-400 ">
                      Your latest account activities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="space-y-4">
                  {userInfo?.lastLogin && (
                    <div className="flex items-start bg-purple-900/10 p-3 rounded border border-purple-900/30">
                      <div className="mt-1 rounded-full p-1 bg-green-500/20 mr-3">
                        <Key size={14} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm">Last login</p>
                        <p className="text-gray-400 text-xs">
                          {formatDateTime(userInfo?.lastLogin)}
                        </p>
                      </div>
                    </div>
                  )}

                  {userInfo?.passwordLastChanged && (
                    <div className="flex items-start bg-purple-900/10 p-3 rounded border border-purple-900/30">
                      <div className="mt-1 rounded-full p-1 bg-blue-500/20 mr-3">
                        <Shield size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm">Password updated</p>
                        <p className="text-gray-400 text-xs">
                          {formatDateTime(userInfo?.passwordLastChanged)}
                        </p>
                      </div>
                    </div>
                  )}

                  {userInfo?.loginHistory.length > 0 && (
                    <div className="flex items-start bg-purple-900/10 p-3 rounded border border-purple-900/30">
                      <div className="mt-1 rounded-full p-1 bg-yellow-500/20 mr-3">
                        <Laptop2 size={14} className="text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm">Last Device</p>
                        <p className="text-gray-400 text-xs">
                          {lastDeviceInfo(userInfo?.loginHistory)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Login History */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all">
            <CardHeader className="border-b border-purple-900/30">
              <div className="flex items-center space-x-3 mb-4">
                <Shield size={22} className="text-purple-500" />
                <div>
                  <CardTitle className="text-white">Login History</CardTitle>
                  <CardDescription className="text-gray-400">
                    Recent account access attempts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!userInfo?.loginHistory ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No login history available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-purple-900/30">
                      <tr>
                        <th className="text-left pb-3 text-gray-400 text-sm font-medium">
                          Date & Time
                        </th>
                        <th className="text-left pb-3 text-gray-400 text-sm font-medium">
                          IP Address
                        </th>
                        <th className="text-left pb-3 text-gray-400 text-sm font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userInfo?.loginHistory?.slice(0, 5).map((item, key) => (
                        <tr key={key} className="border-b border-purple-900/10">
                          <td className="py-3 text-gray-300 text-sm">
                            {formatDateTime(item.createdAt)}
                          </td>
                          <td className="py-3 text-gray-300 text-sm">
                            <div className="flex items-center">
                              <MapPin
                                size={14}
                                className="text-purple-500 mr-1"
                              />
                              {item.ipAddress || "Unknown"}
                            </div>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${item.success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                            >
                              {item.success ? "Success" : "Failed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Alerts */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all">
            <CardHeader className="border-b border-purple-900/30">
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle size={22} className="text-purple-500" />
                <div>
                  <CardTitle className="text-white">
                    Security Insights
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Security status of your account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Failed Login Attempts */}
                <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">
                      Failed Login Attempts
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        userInfo?.loginHistory?.filter(
                          (login) => !login.success,
                        ).length > 0
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {userInfo?.loginHistory?.filter((item) => !item.success)
                        ?.length || 0}{" "}
                      attempts
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {userInfo?.loginHistory?.filter((item) => !item.success)
                      ?.length > 0
                      ? "There have been unsuccessful login attempts. Monitor your account closely."
                      : "No failed login attempts detected. Your account is secure."}
                  </p>
                </div>

                {/* Last Password Change */}
                <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">Password Age</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        calculateAccountAge(userInfo?.passwordLastChanged) > 20
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {calculateAccountAge(userInfo?.passwordLastChanged) || 0}{" "}
                      days
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {calculateAccountAge(userInfo?.passwordLastChanged) > 20
                      ? "Your password was last changed over 20 days ago. Consider updating it."
                      : "Your password was updated recently."}
                  </p>
                </div>

                {/* Email Verification */}
                <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">
                      Email Verification
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        userInfo?.isVerified
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {userInfo?.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {userInfo?.isVerified
                      ? "Your email has been successfully verified."
                      : "Please verify your email for additional security."}
                  </p>
                </div>

                {/* Device Information */}
                <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">Active Devices</h3>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                      {new Set(
                        userInfo?.loginHistory
                          ?.map((login) => login.userAgent)
                          .filter((ua) => ua)
                          .filter((ua, i, arr) => arr.indexOf(ua) === i),
                      ).size || 1}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Detected login from{" "}
                    {userInfo?.loginHistory?.[0]?.userAgent?.split(" ")[0] ||
                      "Unknown"}{" "}
                    device.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-stretch">
          {/* Security Health */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="h-full"
          >
            <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 bg-purple-600/10 rounded-full -translate-y-32 translate-x-32 blur-3xl pointer-events-none" />

              <CardHeader className="border-b border-purple-900/30 relative z-10 pb-4">
                <div className="flex items-center space-x-3">
                  <Shield size={22} className="text-purple-500" />
                  <div>
                    <CardTitle className="text-white">
                      Security Health
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Security assessment & recommendations
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 relative z-10 flex-1">
                <div className="flex flex-col xl:flex-row gap-8 items-center h-full justify-center">
                  {/* Left: Circular Progress & Score */}
                  <div className="flex flex-col items-center justify-center flex-shrink-0">
                    <SecurityHealth score={calculateSecurityScore(userInfo)} />
                    <div className="text-center mt-4">
                      <h3
                        className={`text-2xl font-bold ${
                          getSecurityLevel(calculateSecurityScore(userInfo))
                            .color === "green"
                            ? "text-green-400"
                            : getSecurityLevel(calculateSecurityScore(userInfo))
                                  .color === "blue"
                              ? "text-blue-400"
                              : getSecurityLevel(
                                    calculateSecurityScore(userInfo),
                                  ).color === "yellow"
                                ? "text-yellow-400"
                                : "text-red-400"
                        }`}
                      >
                        {
                          getSecurityLevel(calculateSecurityScore(userInfo))
                            .level
                        }
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">
                        Security Score
                      </p>
                    </div>
                  </div>

                  {/* Right: Recommendations List */}
                  <div className="flex-1 w-full xl:w-auto xl:border-l xl:border-purple-900/30 xl:pl-8 flex flex-col justify-center">
                    <h4 className="text-gray-300 font-medium mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <AlertCircle size={14} className="text-purple-400" />
                      Action Items
                    </h4>

                    {calculateSecurityScore(userInfo) === 100 ? (
                      <div className="flex items-center gap-3 text-green-400 bg-green-900/10 p-3 rounded-lg border border-green-900/30">
                        <div className="bg-green-500/20 p-1 rounded-full">
                          <Shield size={16} />
                        </div>
                        <span className="text-sm">
                          Great job! Your account is fully secured.
                        </span>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {!userInfo?.isVerified && (
                          <li className="flex items-start gap-3 text-sm text-gray-400 group">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0 group-hover:bg-red-400 transition-colors" />
                            <span>Verify email address</span>
                          </li>
                        )}
                        {!userInfo?.twoFactor?.enabled && (
                          <li className="flex items-start gap-3 text-sm text-gray-400 group">
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0 group-hover:bg-yellow-400 transition-colors" />
                            <span>Enable 2FA authentication</span>
                          </li>
                        )}
                        {calculateAccountAge(userInfo?.passwordLastChanged) >=
                          90 && (
                          <li className="flex items-start gap-3 text-sm text-gray-400 group">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                            <span>Rotate old password ({`>`}90 days)</span>
                          </li>
                        )}
                        {userInfo?.loginHistory
                          ?.slice(0, 5)
                          .filter((v) => !v.success).length > 0 && (
                          <li className="flex items-start gap-3 text-sm text-gray-400 group">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                            <span>Review recent failed logins</span>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 2. Login Trends Graph Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="h-full" // Ensure div takes full height
          >
            <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all h-full flex flex-col">
              <CardHeader className="border-b border-purple-900/30 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity size={22} className="text-purple-500" />
                    <div>
                      <CardTitle className="text-white">
                        Login Activity
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Traffic over last 7 days
                      </CardDescription>
                    </div>
                  </div>
                  {/* Badge aligned with header */}
                  <div className="bg-purple-900/10 px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-xs font-medium text-purple-300">
                      {userInfo?.loginHistory?.length || 0} Events
                    </span>
                  </div>
                </div>
              </CardHeader>

              {/* Flex-1 ensures the graph container expands to fill the remaining height matching the neighbor card */}
              <CardContent className="pt-6 flex-1 min-h-[250px] flex flex-col justify-center">
                <LoginActivityGraph loginHistory={userInfo?.loginHistory} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
