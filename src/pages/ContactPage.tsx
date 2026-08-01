import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  MessageCircle,
  Clock,
  Globe,
  Instagram,
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mnnvkoyg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Form submission failed");

      toast.success("Message sent successfully! I'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error("Oops! Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "k.monishwaran123@gmail.com",
      href: "mailto:monishwaran123@gmail.com",
      description: "Send me an email anytime",
      type: "link",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91 7358996358",
      href: "tel:+917358996358",
      description: "Call me during business hours",
      type: "link",
    },
    {
      icon: MapPin,
      title: "Location",
      value:
        "25/45, South 3rd Street, Triplicane, Chennai, Tamil Nadu 600005",
      href: "https://www.google.com/maps/place/25%2F45,+South+3rd+St,+Triplicane,+Chennai,+Tamil+Nadu+600005/@13.0557138,80.2798048,21z",
      description: "Available for local meetups",
      type: "link",
      target: "_blank",
      rel: "noopener noreferrer",
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Within 24 hours",
      description: "I typically respond quickly",
      type: "info",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/Monishwarann",
      label: "GitHub",
      color: "text-gray-500",
      bg: "gray-500",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/monishwaran-k-b463a3363/",
      label: "LinkedIn",
      color: "text-blue-500",
      bg: "blue-500",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/k._.monish",
      label: "Instagram",
      color: "text-pink-500",
      bg: "pink-500",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16 lg:mb-24"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 lg:mb-8">
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto">
              Ready to collaborate? Let's discuss your next project or just say
              hello!
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 lg:mb-24"
          >
            {[
              { label: "Response Rate", value: "95%", icon: MessageCircle },
              { label: "Avg Response Time", value: "< 24h", icon: Clock },
              { label: "Projects Completed", value: "10+", icon: Globe },
              { label: "Happy Clients", value: "2", icon: Mail },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + index * 0.04, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 lg:p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-3 lg:mb-4 text-cyan-400" />
                <div className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm lg:text-base text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Contact Information */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8 lg:space-y-12"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 lg:mb-8">
                  Let's Start a Conversation
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 lg:mb-12">
                  I'm always interested in new opportunities, innovative
                  projects, and meaningful collaborations. Whether you have a
                  project in mind or just want to connect, I'd love to hear from
                  you.
                </p>
              </motion.div>

              {/* Contact Info Cards */}
              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => {
                  const cardProps = {
                    variants: itemVariants,
                    whileHover: info.type === "link" ? { scale: 1.02, y: -5 } : {},
                    className: `block p-6 lg:p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 ${
                      info.type === "link"
                        ? "hover:border-cyan-500/50 cursor-pointer"
                        : "border-gray-700/30"
                    } transition-all duration-300`,
                  };

                  const cardContent = (
                    <>
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl flex items-center justify-center mb-4 lg:mb-6">
                        <info.icon size={24} className="text-white" />
                      </div>
                      <h3 className="font-semibold text-white text-lg lg:text-xl mb-2">
                        {info.title}
                      </h3>
                      <p className="text-cyan-400 text-sm font-medium mb-2">
                        {info.value}
                      </p>
                      <p className="text-gray-500 text-sm">{info.description}</p>
                    </>
                  );

                  if (info.type === "link") {
                    return (
                      <motion.a
                        key={index}
                        href={info.href}
                        target={info.target}
                        rel={info.rel}
                        {...cardProps}
                      >
                        {cardContent}
                      </motion.a>
                    );
                  }

                  return (
                    <motion.div key={index} {...cardProps}>
                      {cardContent}
                    </motion.div>
                  );
                })}
              </div>

              {/* Social Links */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-semibold text-white">
                  Connect with me
                </h3>
                <div className="flex gap-4 lg:gap-6">
                  {socialLinks.map((social) => (
                    <motion.div
                      key={social.label}
                      className="relative group"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        onClick={() => window.open(social.href, "_blank")}
                        className={`w-14 h-14 lg:w-16 lg:h-16 bg-gray-800/50 backdrop-blur-sm border cursor-pointer border-gray-700/50 rounded-xl flex items-center justify-center transition-all duration-300 hover:${social.bg}`}
                      >
                        <social.icon
                          size={24}
                          className={`${social.color} transition-colors`}
                        />
                      </motion.div>

                      {/* Tooltip */}
                      <div
                        className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-${social.bg} text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap`}
                      >
                        {social.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                variants={itemVariants}
                className="relative p-8 lg:p-12 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 rounded-2xl" />
                <div className="relative z-10">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8">
                    Send a Message
                  </h3>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 lg:space-y-8"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          {...register("name", {
                            required: "Name is required",
                          })}
                          className="w-full px-4 py-3 lg:py-4 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors text-white placeholder-gray-400"
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          className="w-full px-4 py-3 lg:py-4 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors text-white placeholder-gray-400"
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        {...register("subject", {
                          required: "Subject is required",
                        })}
                        className="w-full px-4 py-3 lg:py-4 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors text-white placeholder-gray-400"
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        {...register("message", {
                          required: "Message is required",
                        })}
                        className="w-full px-4 py-3 lg:py-4 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-colors text-white placeholder-gray-400 resize-none"
                        placeholder="Tell me about your project or just say hello..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 lg:py-5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
