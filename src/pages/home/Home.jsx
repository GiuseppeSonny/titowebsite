import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.scss";
import { useData } from "../../context/DataContext";

const Home = () => {
  const navigate = useNavigate();
  const { events: rawEvents, photos } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const upcomingEvents = rawEvents.map((e) => ({
    ...e,
    date: e.date instanceof Date ? e.date : new Date(e.date + "T12:00:00"),
  }));

  const highlights = photos.slice(0, 3).map((photo) => ({
    title: photo.caption || "Untitled",
    body: photo.category,
    badge: photo.category,
    image: photo.url,
    link: photo.link || photo.workId ? (photo.workId ? `/works/${photo.workId}` : "#") : "/works",
  }));

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
          <p className={styles.kicker}>Street Artist / 2026</p>
          <h1>
            Stencils on concrete
            <span> that glow after dark</span>
          </h1>
          <p className={styles.subhead}>
            Raw blacks, bright reds, and layered wheatpaste textures—urban stories sprayed loud across the city.
          </p>
          <div className={styles.ctaRow}>
            <button className={styles.primaryCta}>View the stencils</button>
            <button className={styles.secondaryCta}>Commission a wall</button>
          </div>
          <div className={styles.metrics}>
            <div>
              <span>73</span>
              <p>Murals painted</p>
            </div>
            <div>
              <span>18</span>
              <p>Cities tagged</p>
            </div>
            <div>
              <span>∞</span>
              <p>Ideas in ink</p>
            </div>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.glow} />
          <div className={styles.cardStack}>
            <div className={styles.cardPrimary}>
              <p>Current focus</p>
              <h3>Night train murals</h3>
              <span>Neon, chrome, grit</span>
            </div>
            <div className={styles.cardSecondary}>
              <p>Tech stack</p>
              <div className={styles.chips}>
                {"Spray · Ink · Light ".split(" · ").map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
            <div className={styles.cardTertiary}>
              <p>Upcoming drop</p>
              <h4>Subway Bloom</h4>
              <small>Spring equinox</small>
            </div>
          </div>
        </div>
      </section>

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
