const defaultRequirements = [
    'Exceptional problem-solving skills and ability to work in fast-paced environments',
    'Strong foundation in algorithms, data structures, and system design',
    'Experience with large-scale distributed systems and microservices',
    'Passion for continuous learning and embracing new technologies'
];

const defaultCulture = [
    { title: 'Think 10x', description: 'We strive for improvements that are ten times better, not just ten percent.' },
    { title: 'Psychological Safety', description: 'We foster an environment where team members feel safe to take risks and be vulnerable.' },
    { title: 'Data-Driven Decisions', description: 'Opinions are hypothesis; data is truth.' }
];

const defaultReviews = [
    { author: 'Anonymous Developer', role: 'Senior Software Engineer', rating: 5, comment: 'The scale of problems you get to solve here is unparalleled. Amazing perks and brilliant colleagues.' },
    { author: 'Former Employee', role: 'Product Manager', rating: 4, comment: 'Incredible talent pool and resources, but navigating the bureaucracy can sometimes be slow and challenging.' }
];



const companiesData = [
    {
        name: 'Google',
        description: 'Organizing the world’s information and making it universally accessible and useful through AI, search, and cloud computing. We continuously innovate in massive scale distributed systems and advanced machine learning to build ecosystems that billions rely on daily.',
        icon: 'search', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png', foundedYear: '1998', companySize: '10000+', headquarters: 'Mountain View, CA', location: 'Bangalore', website: 'google.com', ceo: 'Sundar Pichai', revenue: '$305.6 Billion', techStack: ['Python', 'C++', 'Go', 'TensorFlow', 'Kubernetes'], rating: 4.8, jobs: 6, industry: 'Information Technology', funding: 'Public', remoteFriendly: true, gradient: 'from-blue-500 via-red-500 to-yellow-500',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://upload.wikimedia.org/wikipedia/commons/e/e0/Googleplex_HQ_%28cropped%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Google_logo_at_Googleplex.jpg/1200px-Google_logo_at_Googleplex.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/4/41/Google_campus_in_silicon_valley.jpg'
        ]
    },
    {
        name: 'Microsoft',
        description: 'Empowering every person and every organization on the planet to achieve more through cloud, edge, and AI innovation. We are responsible for widely adopted productivity tools, enterprise-grade cloud solutions, and massive investments into LLM models shaping the next technological era.',
        icon: 'window', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png', foundedYear: '1975', companySize: '10000+', headquarters: 'Redmond, WA', location: 'Hyderabad', website: 'microsoft.com', ceo: 'Satya Nadella', revenue: '$211.9 Billion', techStack: ['C#', '.NET', 'TypeScript', 'Azure', 'C++'], rating: 4.7, jobs: 6, industry: 'Information Technology', funding: 'Public', remoteFriendly: true, gradient: 'from-blue-600 to-cyan-500',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://upload.wikimedia.org/wikipedia/commons/c/cb/Microsoft_headquarters%2C_Redmond.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Building17.JPG/1200px-Building17.JPG',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Microsoft_Visitor_Center_-_04.jpg/1200px-Microsoft_Visitor_Center_-_04.jpg'
        ]
    },
    {
        name: 'Amazon',
        description: 'Earth’s most customer-centric company, pioneering e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence. Our supply chain logistics combined with unparalleled digital retail scope requires immense low-latency architectural resilience built by incredible engineering talent.',
        icon: 'shopping_cart', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png', foundedYear: '1994', companySize: '10000+', headquarters: 'Seattle, WA', location: 'Bangalore', website: 'amazon.in', ceo: 'Andy Jassy', revenue: '$574.8 Billion', techStack: ['Java', 'C++', 'Python', 'AWS', 'Node.js'], rating: 4.6, jobs: 6, industry: 'E-commerce & Cloud', funding: 'Public', remoteFriendly: true, gradient: 'from-yellow-400 to-orange-500',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Amazon_Spheres_from_7th_Ave_May_2018.jpg/1200px-Amazon_Spheres_from_7th_Ave_May_2018.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/1/12/Amazon_Day_1_tower.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/b/b8/Amazon_HQ_Seattle.jpg'
        ]
    },
    {
        name: 'Meta',
        description: 'Building technologies that help people connect, find communities, and grow businesses across Facebook, Instagram, WhatsApp, and VR. We push the boundaries on spatial computing, massive real-time graph databases, and consumer application scaling serving entire geographical populations concurrently.',
        icon: 'hub', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png', foundedYear: '2004', companySize: '10000+', headquarters: 'Menlo Park, CA', location: 'Gurgaon', website: 'meta.com', ceo: 'Mark Zuckerberg', revenue: '$134.9 Billion', techStack: ['React', 'Hack', 'C++', 'Python', 'GraphQL'], rating: 4.5, jobs: 6, industry: 'Social Media', funding: 'Public', remoteFriendly: true, gradient: 'from-blue-600 to-blue-800',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://images.unsplash.com/photo-1542044801127-14e9f1ed7eb2?w=800',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Facebook_Headquarters_Menlo_Park.jpg/1200px-Facebook_Headquarters_Menlo_Park.jpg',
            'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800'
        ]
    },
    {
        name: 'Netflix',
        description: 'The world’s leading streaming entertainment service, revolutionizing how stories are discovered and enjoyed globally. Our entire video delivery network pushes bits of data to millions of concurrent households, backed by deeply analytical, chaos-tested, custom-built microservice solutions.',
        icon: 'movie', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png', foundedYear: '1997', companySize: '10000+', headquarters: 'Los Gatos, CA', location: 'Mumbai', website: 'netflix.com', ceo: 'Ted Sarandos & Greg Peters', revenue: '$33.7 Billion', techStack: ['Java', 'Spring Boot', 'Node.js', 'React', 'Python'], rating: 4.7, jobs: 6, industry: 'Entertainment', funding: 'Public', remoteFriendly: true, gradient: 'from-red-600 to-red-900',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://upload.wikimedia.org/wikipedia/commons/8/87/Netflix_headquarters.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/2/2f/Netflix_Headquarters_Los_Gatos.jpg',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'
        ]
    },
    {
        name: 'Apple',
        description: 'Designing the world’s best personal computers, leading the digital music revolution, and reinventing the mobile phone. Apple represents the intersection of brilliant hardware and flawless software, deeply focusing on user privacy, on-device intelligence processing, and premium user experience.',
        icon: 'apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1024px-Apple_logo_black.svg.png', foundedYear: '1976', companySize: '10000+', headquarters: 'Cupertino, CA', location: 'Hyderabad', website: 'apple.com', ceo: 'Tim Cook', revenue: '$383.3 Billion', techStack: ['Swift', 'Objective-C', 'C++', 'Python', 'Metal'], rating: 4.8, jobs: 6, industry: 'Consumer Electronics', funding: 'Public', remoteFriendly: false, gradient: 'from-gray-700 to-black',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Apple_Park_Visitor_Center_2.jpg/1200px-Apple_Park_Visitor_Center_2.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Apple_Park_Cupertino_California.jpg/1200px-Apple_Park_Cupertino_California.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Apple_Park_Main_Building_-_aerial_view_2.jpg/1200px-Apple_Park_Main_Building_-_aerial_view_2.jpg'
        ]
    },
    {
        name: 'Tesla',
        description: 'Accelerating the world’s transition to sustainable energy with electric cars, solar and integrated renewable energy solutions. From firmware optimizations in vehicles to massive simulation frameworks training our Full Self-Driving neural networks, we tackle immense multi-disciplinary engineering hurdles.',
        icon: 'directions_car', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/2048px-Tesla_Motors.svg.png', foundedYear: '2003', companySize: '10000+', headquarters: 'Austin, TX', location: 'Pune', website: 'tesla.com', ceo: 'Elon Musk', revenue: '$96.7 Billion', techStack: ['C++', 'Python', 'Go', 'React', 'PyTorch'], rating: 4.3, jobs: 6, industry: 'Automotive & Energy', funding: 'Public', remoteFriendly: false, gradient: 'from-red-600 to-gray-800',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Tesla_Gigafactory_1_-_December_2020.jpg/1200px-Tesla_Gigafactory_1_-_December_2020.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/d/d6/Tesla_Motors_Showroom.jpg',
            'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800'
        ]
    },
    {
        name: 'Spotify',
        description: 'Unlocking the potential of human creativity by giving a million creative artists the opportunity to live off their art. Our audio streaming infrastructure has to support highly personalized concurrent data streams distributed to over 600 million users actively consuming media worldwide.',
        icon: 'queue_music', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png', foundedYear: '2006', companySize: '5000-10000', headquarters: 'Stockholm, Sweden', location: 'Mumbai', website: 'spotify.com', ceo: 'Daniel Ek', revenue: '$14.3 Billion', techStack: ['Java', 'Python', 'C++', 'Google Cloud', 'React'], rating: 4.6, jobs: 6, industry: 'Audio Streaming', funding: 'Public', remoteFriendly: true, gradient: 'from-green-500 to-green-700',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
        ]
    },
    {
        name: 'Adobe',
        description: 'Changing the world through digital experiences by empowering everyone to create and deliver exceptional digital content. Adobe operates the deepest suite of creative multi-media tooling globally, utilizing incredibly fast local processing paired with powerful generative AI cloud models.',
        icon: 'brush', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/1200px-Adobe_Corporate_Logo.png', foundedYear: '1982', companySize: '10000+', headquarters: 'San Jose, CA', location: 'Noida', website: 'adobe.com', ceo: 'Shantanu Narayen', revenue: '$19.4 Billion', techStack: ['C++', 'Java', 'Python', 'React', 'Rust'], rating: 4.5, jobs: 6, industry: 'Computer Software', funding: 'Public', remoteFriendly: true, gradient: 'from-red-600 to-red-500',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
            'https://upload.wikimedia.org/wikipedia/commons/c/ce/Adobe_Headquarters_in_San_Jose.jpg'
        ]
    },
    {
        name: 'Salesforce',
        description: 'Bringing companies and customers together through a massive, adaptable, and highly secure CRM ecosystem built in the cloud. We pioneer B2B software delivery through multi-tenant architecture, allowing thousands of businesses to simultaneously orchestrate their entire workflows safely.',
        icon: 'cloud', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png', foundedYear: '1999', companySize: '10000+', headquarters: 'San Francisco, CA', location: 'Bangalore', website: 'salesforce.com', ceo: 'Marc Benioff', revenue: '$34.8 Billion', techStack: ['Apex', 'Java', 'Lightning', 'Python', 'AWS'], rating: 4.4, jobs: 6, industry: 'Cloud Software', funding: 'Public', remoteFriendly: true, gradient: 'from-blue-400 to-blue-600',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Salesforce_Tower_and_Transbay_Transit_Center.jpg/1200px-Salesforce_Tower_and_Transbay_Transit_Center.jpg',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1542044801127-14e9f1ed7eb2?w=800'
        ]
    },
    {
        name: 'Oracle',
        description: 'Providing integrated suites of cloud applications and unified database infrastructure securely powering the vast global enterprise backbones. Our database systems and hyperscale cloud grids execute millions of complex enterprise transactions per second across every major corporate entity.',
        icon: 'storage', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/2560px-Oracle_logo.svg.png', foundedYear: '1977', companySize: '10000+', headquarters: 'Austin, TX', location: 'Hyderabad', website: 'oracle.com', ceo: 'Safra Catz', revenue: '$52.9 Billion', techStack: ['Java', 'C', 'C++', 'Python', 'Oracle Cloud'], rating: 3.9, jobs: 6, industry: 'Enterprise Software', funding: 'Public', remoteFriendly: true, gradient: 'from-red-600 to-gray-800',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://upload.wikimedia.org/wikipedia/commons/7/75/Oracle_Corporate_Headquarters.jpg',
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
        ]
    },
    {
        name: 'IBM',
        description: 'Leading in hybrid cloud and AI infrastructure, applying deep research to build foundational mainframes and quantum systems. IBM combines consulting with powerful proprietary hardware architectures to help the worlds most regulated industries modernize operations safely and securely.',
        icon: 'memory', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png', foundedYear: '1911', companySize: '10000+', headquarters: 'Armonk, NY', location: 'Pune', website: 'ibm.com', ceo: 'Arvind Krishna', revenue: '$61.8 Billion', techStack: ['Java', 'Python', 'Red Hat', 'C++', 'Node.js'], rating: 4.1, jobs: 6, industry: 'Information Technology', funding: 'Public', remoteFriendly: true, gradient: 'from-blue-800 to-blue-900',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
            'https://images.unsplash.com/photo-1620023647321-4f1bd9a4f48d?w=800'
        ]
    },
    {
        name: 'NVIDIA',
        description: 'Pioneering accelerated computing, inventing the GPU to ignite modern PC gaming and power the global generative AI revolution. We build the physical and software layers containing the massive parallelized compute requirements needed to train the modern deep learning models redefining civilization.',
        icon: 'developer_board', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/2560px-Nvidia_logo.svg.png', foundedYear: '1993', companySize: '10000+', headquarters: 'Santa Clara, CA', location: 'Bangalore', website: 'nvidia.com', ceo: 'Jensen Huang', revenue: '$60.9 Billion', techStack: ['C++', 'CUDA', 'Python', 'C', 'Deep Learning'], rating: 4.8, jobs: 6, industry: 'Semiconductors', funding: 'Public', remoteFriendly: false, gradient: 'from-green-600 to-green-800',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://images.unsplash.com/photo-1542044801127-14e9f1ed7eb2?w=800',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
        ]
    },
    {
        name: 'AMD',
        description: 'Developing high-performance computing and visualization products solving some of the world’s toughest challenges. From powerful CPUs for hyperscaler datacenters to dynamic APUs running gaming consoles, our silicon engineering drives phenomenal performance increases generationally.',
        icon: 'memory', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/2560px-AMD_Logo.svg.png', foundedYear: '1969', companySize: '10000+', headquarters: 'Santa Clara, CA', location: 'Hyderabad', website: 'amd.com', ceo: 'Lisa Su', revenue: '$22.6 Billion', techStack: ['C++', 'Verilog', 'Python', 'C', 'Linux'], rating: 4.3, jobs: 6, industry: 'Semiconductors', funding: 'Public', remoteFriendly: true, gradient: 'from-red-600 to-black',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1542044801127-14e9f1ed7eb2?w=800'
        ]
    },
    {
        name: 'Uber',
        description: 'Reimagining the way the world moves for the better, coordinating millions of real-time multi-point ride and delivery logistics. We solve enormous traveling salesman problems dynamically on-the-fly, dispatching and routing millions of drivers flawlessly through global urban macro-grids.',
        icon: 'directions_car', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png', foundedYear: '2009', companySize: '10000+', headquarters: 'San Francisco, CA', location: 'Bangalore', website: 'uber.com', ceo: 'Dara Khosrowshahi', revenue: '$37.2 Billion', techStack: ['Go', 'Java', 'Python', 'Node.js', 'React'], rating: 4.0, jobs: 6, industry: 'Transportation', funding: 'Public', remoteFriendly: true, gradient: 'from-black to-gray-800',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://upload.wikimedia.org/wikipedia/commons/c/c5/Uber_HQ_SF.jpg',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
            'https://images.unsplash.com/photo-1620023647321-4f1bd9a4f48d?w=800'
        ]
    },
    {
        name: 'Stripe',
        description: 'Building the economic infrastructure for the internet, making it inherently easier for businesses to accept payments and grow. From fraud prevention to massive API throughput, our engineering demands absolute correctness for financial ledgers operating exactly at 99.999% uptime securely.',
        icon: 'payments', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png', foundedYear: '2010', companySize: '5000-10000', headquarters: 'South San Francisco, CA', location: 'Bangalore', website: 'stripe.com', ceo: 'Patrick Collison', revenue: '$14 Billion', techStack: ['Ruby', 'Java', 'Go', 'React', 'AWS'], rating: 4.8, jobs: 6, industry: 'Financial Services', funding: 'Private', remoteFriendly: true, gradient: 'from-indigo-500 to-purple-600',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800',
            'https://images.unsplash.com/photo-1542044801127-14e9f1ed7eb2?w=800',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
        ]
    },
    {
        name: 'Airbnb',
        description: 'Creating a world where anyone can belong anywhere, driving a colossal marketplace for short-term homestays and unique experiences. We design incredibly beautiful user interfaces sitting on top of highly volatile property availability datastores optimized globally for localized geographical search.',
        icon: 'home', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_Bélo.svg/2560px-Airbnb_Logo_Bélo.svg.png', foundedYear: '2008', companySize: '5000-10000', headquarters: 'San Francisco, CA', location: 'Gurgaon', website: 'airbnb.com', ceo: 'Brian Chesky', revenue: '$9.9 Billion', techStack: ['Ruby on Rails', 'Java', 'React', 'Kotlin', 'Swift'], rating: 4.3, jobs: 6, industry: 'Hospitality', funding: 'Public', remoteFriendly: true, gradient: 'from-rose-500 to-pink-600',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Airbnb_headquarters.jpg/1200px-Airbnb_headquarters.jpg',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'
        ]
    },
    {
        name: 'Flipkart',
        description: 'India\'s leading e-commerce marketplace, democratizing digital retail across a massively diverse and complex demographic grid. We engineer the supply chain backend capable of handling millions of peak simultaneous transactions during festivals, optimizing entire warehousing robotics fleets concurrently.',
        icon: 'local_mall', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Flipkart_logo.svg/2560px-Flipkart_logo.svg.png', foundedYear: '2007', companySize: '10000+', headquarters: 'Bangalore, India', location: 'Bangalore', website: 'flipkart.com', ceo: 'Kalyan Krishnamurthy', revenue: '$6.8 Billion', techStack: ['Java', 'Go', 'Python', 'React', 'MySQL'], rating: 4.1, jobs: 6, industry: 'E-commerce', funding: 'Private', remoteFriendly: true, gradient: 'from-blue-500 to-yellow-400',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
            'https://images.unsplash.com/photo-1542044801127-14e9f1ed7eb2?w=800'
        ]
    },
    {
        name: 'Zomato',
        description: 'Connecting millions of people with amazing local culinary experiences spanning food delivery, dining out, and rapid grocery routing. We process colossal bursts of hyperlocal GPS routing demands paired with deeply personalized dynamic search recommendations delivered seamlessly under incredibly strict real-time SLA constraints.',
        icon: 'restaurant', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Zomato_logo.svg/2560px-Zomato_logo.svg.png', foundedYear: '2008', companySize: '5000-10000', headquarters: 'Gurgaon, India', location: 'Gurgaon', website: 'zomato.com', ceo: 'Deepinder Goyal', revenue: '$1.4 Billion', techStack: ['Node.js', 'Python', 'React Native', 'AWS', 'Redis'], rating: 4.0, jobs: 6, industry: 'Food Delivery', funding: 'Public', remoteFriendly: true, gradient: 'from-red-500 to-red-700',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800'
        ]
    },
    {
        name: 'Paytm',
        description: 'Pioneering digital financial inclusion across India, processing colossal volumes of micro-transactions natively through localized QR code networking. We deliver enterprise-grade banking encryption alongside immense high-frequency payment ledgers serving billions of routine retail checkouts securely.',
        icon: 'account_balance_wallet', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Paytm_logo.svg/2560px-Paytm_logo.svg.png', foundedYear: '2010', companySize: '10000+', headquarters: 'Noida, India', location: 'Noida', website: 'paytm.com', ceo: 'Vijay Shekhar Sharma', revenue: '$1.1 Billion', techStack: ['Java', 'Node.js', 'Go', 'React', 'MongoDB'], rating: 3.7, jobs: 6, industry: 'Financial Technology', funding: 'Public', remoteFriendly: true, gradient: 'from-blue-400 to-blue-700',
        requirements: defaultRequirements, culture: defaultCulture, reviews: defaultReviews,
        cultureImages: [
            'https://images.unsplash.com/photo-1620023647321-4f1bd9a4f48d?w=800',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
            'https://images.unsplash.com/photo-1542044801127-14e9f1ed7eb2?w=800'
        ]
    }
];

module.exports = companiesData;
