import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.scss";
import { useData } from "../../context/DataContext";
import MediaPlayer from "../../componets/MediaPlayer/MediaPlayer";

const Home = () => {
  const navigate = useNavigate();
  const { events: rawEvents, products, works, home } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const heroLogos = Array.isArray(home.hero?.logos) ? home.hero.logos : [];

  const upcomingEvents = rawEvents.map((e) => ({
    ...e,
    date: e.date instanceof Date ? e.date : new Date(e.date + "T12:00:00"),
  }));

  const highlights = (() => {
  // Use admin-selected highlights if available, otherwise fallback to auto-generated
  if (home.highlights && home.highlights.length > 0) {
    return home.highlights;
  }
  
  // Fallback to auto-generated highlights if no admin selection
  const worksArray = Array.isArray(works) ? works : [];
  if (worksArray.length === 0) return [];
  
  // Define the 2 categories we want to feature
  const categories = ["internal", "external"];
  const selectedWorks = [];
  
  // Get one work from each category
  categories.forEach(category => {
    const work = worksArray.find(w => w.category === category);
    if (work) {
      selectedWorks.push(work);
    }
  });
  
  return selectedWorks.map((work) => {
    const getImageUrl = (work) => {
      if (work.image) return work.image;
      if (work.images && work.images.length > 0) return work.images[0];
      return null;
    };
    
    return {
      title: work.title || "Untitled",
      body: work.desc || "",
      badge: work.category.charAt(0).toUpperCase() + work.category.slice(1),
      image: getImageUrl(work),
      link: `/works/${work.category}`,
    };
  });
})();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (day, month, year) => {
    return upcomingEvents.filter(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === month && 
      event.date.getFullYear() === year
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day, selectedMonth, selectedYear);
      const hasEvents = events.length > 0;
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === selectedMonth && 
                     new Date().getFullYear() === selectedYear;
      
      days.push(
        <div 
          key={day} 
          className={`${styles.calendarDay} ${hasEvents ? styles.hasEvents : ''} ${isToday ? styles.today : ''}`}
        >
          <span className={styles.dayNumber}>{day}</span>
          {hasEvents && (
            <div className={styles.eventDots}>
              {events.slice(0, 3).map((event, index) => (
                <div 
                  key={index} 
                  className={`${styles.eventDot} ${styles[event.type]}`}
                  title={event.title}
                ></div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const getUpcomingEventsForCurrentMonth = () => {
    return upcomingEvents.filter(event => 
      event.date.getMonth() === selectedMonth && 
      event.date.getFullYear() === selectedYear
    ).sort((a, b) => a.date - b.date);
  };

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoRow}>
            {heroLogos.map((logo, index) => {
              const src = typeof logo === "string" ? logo : logo?.src;
              if (!src) return null;

              const alt = typeof logo === "object" && logo?.alt ? logo.alt : `Logo ${index + 1}`;

              return <img key={`${src}-${index}`} src={src} alt={alt} className={styles.logoImage} />;
            })}
          </div>
        </div>
        <div className={styles.heroText}>
          <p className={styles.kicker}>{home.hero?.kicker || "Street Artist / 2026"}</p>
          <h1>
            {home.hero?.title || "Stencils on concrete"}
            <span>{home.hero?.subtitle || " that glow after dark"}</span>
          </h1>
          <p className={styles.subhead}>
            {home.hero?.subhead || "Raw blacks, bright reds, and layered wheatpaste textures—urban stories sprayed loud across the city."}
          </p>
        </div>
      </section>

      <MediaPlayer
        videos={home.video?.videos || []}
        enabled={home.video?.enabled || false}
        className={styles.homeVideo}
        alwaysShow={true}
      />

      <section className={styles.highlights}>
        {highlights.map((item) => (
          <article key={item.title} className={styles.highlightCard} onClick={() => navigate(item.link)}>
            <div className={styles.highlightImage}>
              <img src={item.image} alt={item.title} />
            </div>
            <span className={styles.badge}>{item.badge}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className={styles.calendarSection}>
        <div className={styles.calendarHeader}>
          <h2>Upcoming Events</h2>
          <div className={styles.monthNavigation}>
            <button onClick={prevMonth} className={styles.navButton}>←</button>
            <h3>{monthNames[selectedMonth]} {selectedYear}</h3>
            <button onClick={nextMonth} className={styles.navButton}>→</button>
          </div>
        </div>
        
        <div className={styles.calendarContainer}>
          <div className={styles.calendar}>
            <div className={styles.calendarWeekdays}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className={styles.weekday}>{day}</div>
              ))}
            </div>
            <div className={styles.calendarDays}>
              {renderCalendar()}
            </div>
          </div>
          
          <div className={styles.eventsList}>
            <h4>Events This Month</h4>
            {getUpcomingEventsForCurrentMonth().length > 0 ? (
              getUpcomingEventsForCurrentMonth().map((event, index) => (
                <div key={index} className={styles.eventCard}>
                  <div className={styles.eventDate}>
                    <span className={styles.eventDay}>{event.date.getDate()}</span>
                    <span className={styles.eventMonth}>{monthNames[event.date.getMonth()].slice(0, 3)}</span>
                  </div>
                  <div className={styles.eventDetails}>
                    <h5>{event.title}</h5>
                    <p>{event.location}</p>
                    <span className={`${styles.eventType} ${styles[event.type]}`}>{event.type}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noEvents}>No events this month</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
