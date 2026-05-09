import FAQItem from "@/app/components/FAQItem";

export default function FAQPage(){
    return (
        <div className="container mx-auto px-4 py-12 text-white">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">
                Frequently Asked Questions
            </h2>
            <div className="space-y-6">
                <FAQItem
                    question="What is Mode?"
                    answer="Mode is a project management tool inspired by Linear. It helps teams organize, track, and manage their projects and issues."
                />
                
                <FAQItem
                    question="How do I create an account?"
                    answer="You can create an account by clicking the 'Sign Up' button in the top navigation bar. You will need to provide an Email address and create a Password."
                />
                
                <FAQItem
                    question="Is it free to use?"
                    answer="Yes, Mode is completely free to use as it is an open source project. You can even download the source code and host it yourself."
                />
                
                <FAQItem
                    question="Can i contribute to the project?"
                    answer={`Absolutely! Mode is open Source and contributions are welcome. Check out our Github repository to get started.`}
                />
                
                <FAQItem
                    question="How do I report Bugs or Request Features?"
                    answer={`You can report Bugs or request Features by opening an issue on our Github repository. We are appreciate your feedback and contributions.`}
                /> 
                
                <FAQItem
                    question="What technologies does Mode use?"
                    answer={`Mode is built with Next.js, Typescript, Tailwind CSS, and uses a PostgreSQL database. It leverages the latest features of Next.js App Router for optimal performance.`}
                />
            </div>
        </div>
    );
}

