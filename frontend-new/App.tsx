import { motion } from "framer-motion";
import AdminLayout from "./layouts/AdminLayout";
import { fadeIn } from "./utils/motion";

const activities = [
  {
    title: "Campaign launch",
    description: "New multi-channel marketing campaign launched successfully.",
    time: "2 hours ago",
  },
  {
    title: "Revenue milestone",
    description: "Monthly recurring revenue crossed the 50k mark for the first time.",
    time: "6 hours ago",
  },
  {
    title: "Team activity",
    description: "Product team shipped four improvements to the onboarding flow.",
    time: "yesterday",
  },
];

export default function App() {
  return (
    <AdminLayout>
      <section className="mx-auto mt-8 flex max-w-6xl flex-col gap-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="rounded-3xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-6 text-sm text-emerald-700 shadow-inner dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
        >
          <p className="font-medium">Try resizing the window and toggling the navigation.</p>
          <p className="mt-1 text-xs">
            The layout will automatically switch between the full sidebar and the compact mini sidebar, maintaining smooth animations and a consistent experience across devices.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-lg shadow-gray-900/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest activity</h2>
            <ul className="mt-4 space-y-4">
              {activities.map((activity) => (
                <li
                  key={activity.title}
                  className="rounded-2xl border border-gray-200/70 bg-white/80 p-4 shadow-sm shadow-gray-900/5 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/40"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.description}</p>
                  <span className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-emerald-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {activity.time}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.aside
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4 rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-md shadow-gray-900/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team availability</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Sarah</strong> – Online</p>
              <p><strong>Hector</strong> – Focus mode</p>
              <p><strong>Mina</strong> – Out of office</p>
              <p><strong>Jon</strong> – Reviewing pull requests</p>
            </div>
            <button
              type="button"
              className="mt-auto inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02] hover:bg-emerald-600 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500/70"
            >
              Invite teammate
            </button>
          </motion.aside>
        </div>
      </section>
    </AdminLayout>
  );
}
