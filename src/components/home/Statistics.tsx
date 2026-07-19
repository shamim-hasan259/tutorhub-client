'use client';

export default function Statistics() {
  const stats = [
    { value: '500+', label: 'Expert Tutors' },
    { value: '10,000+', label: 'Students Helped' },
    { value: '50,000+', label: 'Sessions Completed' },
    { value: '4.9', label: 'Average Rating' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
