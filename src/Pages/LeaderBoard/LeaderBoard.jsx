import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import Banner from "../../Components/Banner/Banner";
import "./LeaderBoard.css";

// Sample leaderboard data (expanded for pagination)
const leaderboardData = [
  { id: 1, name: "Sarah Chen", points: 2840, streak: 45 },
  { id: 2, name: "Alex Rodriguez", points: 2720, streak: 42 },
  { id: 3, name: "Maria Kumar", points: 2650, streak: 38 },
  { id: 4, name: "James Wilson", points: 2450, streak: 35 },
  { id: 5, name: "Emily Parker", points: 2380, streak: 30 },
  { id: 6, name: "David Kim", points: 2290, streak: 28 },
  { id: 7, name: "Lisa Thompson", points: 2180, streak: 25 },
  { id: 8, name: "Michael Brown", points: 2020, streak: 22 },
  { id: 9, name: "Sophie Martinez", points: 1950, streak: 20 },
  { id: 10, name: "Chris Taylor", points: 1840, streak: 18 },
  { id: 11, name: "John Smith", points: 1780, streak: 15 },
  { id: 12, name: "Anna Lee", points: 1720, streak: 14 },
  { id: 13, name: "Robert Johnson", points: 1650, streak: 12 },
  { id: 14, name: "Patricia White", points: 1590, streak: 10 },
  { id: 15, name: "Thomas Anderson", points: 1520, streak: 8 },
];

export default function LeaderBoard() {
  const [visibleRows, setVisibleRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaderboardData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleRows((prev) => new Set([...prev, entry.target.dataset.rank]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".lb-row").forEach((row) => {
      observer.observe(row);
    });

    return () => observer.disconnect();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table when changing pages
    document.querySelector('.lb-table__wrap').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sb-app">
      <main>
        <section className="lb-banner">
          <div className="lb-banner__wrap">
            <h1>Champion's Circle</h1>
            <p>Where consistency meets excellence. Every task completed, every milestone achieved adds to your legacy. Who will be this month's top performer?</p>
            
            <div className="lb-stats">
              <div className="lb-stat">
                <span className="lb-stat__number">150K+</span>
                <span className="lb-stat__label">Tasks Completed</span>
              </div>
              <div className="lb-stat">
                <span className="lb-stat__number">45</span>
                <span className="lb-stat__label">Day Streak Record</span>
              </div>
              <div className="lb-stat">
                <span className="lb-stat__number">2.8K</span>
                <span className="lb-stat__label">Top Score</span>
              </div>
            </div>
          </div>
        </section>

        <section className="lb-content">
          <div className="lb-table__wrap">
            <table className="lb-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Member</th>
                  <th>Reward Points</th>
                  <th>Streak</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => (
                  <tr 
                    key={user.id}
                    className={`lb-row ${indexOfFirstItem + index < 3 ? `top-${indexOfFirstItem + index + 1}` : ""} ${
                      visibleRows.has(String(indexOfFirstItem + index + 1)) ? "visible" : ""
                    }`}
                    data-rank={indexOfFirstItem + index + 1}
                  >
                    <td className="rank">
                      <span className="rank-number">{indexOfFirstItem + index + 1}</span>
                    </td>
                    <td className="member">
                      <span className="name">{user.name}</span>
                    </td>
                    <td className="points">{user.points.toLocaleString()}</td>
                    <td className="streak">{user.streak} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="lb-pagination">
                <button 
                  className="pagination-arrow"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                
                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Only show current page, first, last, and pages around current
                    if (
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button 
                          key={pageNumber}
                          className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && currentPage > 3) ||
                      (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      // Show ellipsis
                      return <span key={pageNumber} className="pagination-ellipsis">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button 
                  className="pagination-arrow"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
