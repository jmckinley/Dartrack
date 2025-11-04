import React from 'react';
import { View } from '../types';
import Icon from './Icon';

interface HelpViewProps {
    onNavigate: (view: View) => void;
}

const FAQItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">{question}</h3>
        <div className="text-sm text-gray-400 space-y-3">
            {children}
        </div>
    </div>
);

const GuideStep: React.FC<{ icon: string; step: number; title: string; children: React.ReactNode }> = ({ icon, step, title, children }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-4 flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-lg">{step}</span>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Icon name={icon} className="w-5 h-5 mr-2 text-indigo-400" />
                    {title}
                </h3>
                <div className="text-sm text-gray-400 space-y-2">
                    {children}
                </div>
            </div>
        </div>
    );
};


const HelpView: React.FC<HelpViewProps> = ({ onNavigate }) => {
    return (
        <div className="h-full">
            {/* Custom Header for Help View */}
            <header className="bg-gray-900/70 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-gray-700">
                <div className="max-w-4xl mx-auto flex items-center">
                    <button onClick={() => onNavigate('settings')} className="p-2 -ml-2 rounded-full text-gray-300 hover:bg-gray-700">
                        <Icon name="arrow-left" className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-white ml-2">Help & FAQ</h1>
                </div>
            </header>

            <div className="p-4 space-y-6 pb-24">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white px-2">Getting Started Guide</h2>
                    <GuideStep step={1} icon="sync" title="Sync Your Data">
                        <p>Go to the <strong>Home</strong> or <strong>Inbox</strong> tab and tap the <strong>Sync</strong> button. This pulls in the latest assignments from your mock emails and Canvas iCal feed.</p>
                    </GuideStep>
                    <GuideStep step={2} icon="inbox" title="Review New Tasks">
                        <p>Newly discovered tasks land in your <strong>Inbox</strong>. From here, you can accept, reject, or edit them before they are added to your main task list.</p>
                    </GuideStep>
                    <GuideStep step={3} icon="home" title="Manage Your Dashboard">
                        <p>Your accepted tasks appear on the <strong>Home</strong> screen, prioritized by urgency. Check them off, snooze them for later, or tap the menu to add them to your Google Calendar for reminders.</p>
                    </GuideStep>
                    <GuideStep step={4} icon="schedule" title="Set Up Your Schedule">
                        <p>Add your class times in the <strong>Schedule</strong> tab. This allows the app to create smart deadlines for any "Prep" work, reminding you the night before class.</p>
                    </GuideStep>
                </div>

                <div className="space-y-4 pt-4">
                     <h2 className="text-xl font-bold text-white px-2">Frequently Asked Questions</h2>
                    <FAQItem question="What does the number on the app icon mean?">
                        <p>
                            The badge on the app icon gives you an at-a-glance look at your most urgent tasks. It acts like a "red light / green light" for your to-do list.
                        </p>
                        <div className="bg-gray-900/50 p-3 rounded-md space-y-3">
                            <div>
                                <h4 className="font-semibold text-gray-200">Badge with a Number</h4>
                                <p>This is your "red dot". It shows the total count of tasks that are either <span className="font-semibold text-red-400">overdue</span> or due within the <span className="font-semibold text-yellow-400">next 24 hours</span>.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-200">No Badge</h4>
                                <p>This is your "green dot". It means you have no tasks that are overdue or due in the next 24 hours. You're on top of your immediate priorities!</p>
                            </div>
                        </div>
                    </FAQItem>
                    
                    <FAQItem question="How do I add DarTrack to my phone's home screen?">
                        <p>Adding this app to your home screen makes it feel like a native app. The steps are slightly different for iOS and Android.</p>
                        <div className="bg-gray-900/50 p-3 rounded-md">
                            <h4 className="font-semibold text-gray-200 mb-2">For iOS (Safari):</h4>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Tap the "Share" icon (<Icon name="arrow-up-on-square" className="w-4 h-4 inline-block -mt-1" />) in the browser toolbar.</li>
                                <li>Scroll down and tap "Add to Home Screen".</li>
                                <li>Confirm by tapping "Add".</li>
                            </ol>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-md">
                            <h4 className="font-semibold text-gray-200 mb-2">For Android (Chrome):</h4>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Tap the three-dot menu icon (<Icon name="ellipsis-vertical" className="w-4 h-4 inline-block -mt-1" />) in the top right corner.</li>
                                <li>Tap "Install app" or "Add to Home screen".</li>
                                <li>Follow the on-screen prompts to confirm.</li>
                            </ol>
                        </div>
                    </FAQItem>
                    
                    <FAQItem question="How does the email sync work?">
                        <p>
                            This demo uses mock email data to simulate real-world use. In a production version, you would securely connect your school email account (e.g., via Google OAuth).
                        </p>
                        <p>
                            The app's AI, powered by the Gemini API, reads the content of these emails to find and extract academic tasks like assignments, readings, and quizzes, turning them into structured items for your review in the Inbox.
                        </p>
                    </FAQItem>

                    <FAQItem question="Where does the Canvas data come from?">
                        <p>
                            The app syncs with your Canvas account using its iCal feed URL. This is a one-way sync, meaning the app imports assignments and deadlines from Canvas, but does not send any data back.
                        </p>
                        <p>
                            You can find your iCal URL in your Canvas Calendar settings. Any new assignments your professors post on Canvas will be automatically pulled into your Inbox during the next sync.
                        </p>
                    </FAQItem>

                    <FAQItem question="How can I get reliable reminders for tasks?">
                        <p>
                            While this app helps you organize tasks, it doesn't have its own notification system to keep it lightweight.
                        </p>
                        <p>
                            For the best reminder experience, we recommend using the "Add to Google Calendar" feature on any task. Tap the three-dot menu (<Icon name="ellipsis" className="w-4 h-4 inline-block -mt-1" />) on a task and select "Add to Google Calendar". This will create an event in your phone's default calendar app (like Google Calendar), which provides reliable, native notifications you won't miss.
                        </p>
                    </FAQItem>
                </div>
            </div>
        </div>
    );
};

export default HelpView;