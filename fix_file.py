with open('/home/hassan/Desktop/tot/src/app/app/page.js', 'r') as f:
    js = f.read()

# Fix categories screen
js = js.replace("""                <button
                  key={cat.id}
                  className={`pill ${isSelected ? 'pill-selected' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {cat.emoji} {cat.name}
                </button>
              )
        </div>
      </div>
    );)}""", """                <button
                  key={cat.id}
                  className={`pill ${isSelected ? 'pill-selected' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {cat.emoji} {cat.name}
                </button>
              );
            })}""")

# Fix rating screen
js = js.replace("""                      onClick={() => {
                        setRatingData({...ratingData, rating: item.value});
                        if (ratingStep === 0) setTimeout(() => setRatingStep(1), 300)
        </div>
      </div>
    );}
                    >""", """                      onClick={() => {
                        setRatingData({...ratingData, rating: item.value});
                        if (ratingStep === 0) setTimeout(() => setRatingStep(1), 300);
                      }}
                    >""")

# Fix done screen
js = js.replace("""            <button className="btn btn-primary btn-large btn-full" onClick={() => {
              setScreen('home');
              setRatingStep(0);
              setRatingData({ rating: null, moreOrLess: null, length: null })
        </div>
      </div>
    );}>
              See you tomorrow
            </button>""", """            <button className="btn btn-primary btn-large btn-full" onClick={() => {
              setScreen('home');
              setRatingStep(0);
              setRatingData({ rating: null, moreOrLess: null, length: null });
            }}>
              See you tomorrow
            </button>""")

# Fix renderStepDots
js = js.replace("""  const renderStepDots = (currentStep) => {
    const totalSteps = 6;
    return (
      <div className="app-desktop-shell">
        <div className="app-desktop-card">
          <div className={styles.stepDots}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`${styles.dot} ${i + 1 === currentStep ? styles.dotActive : ''}`} 
          />
        ))}
      </div>
        </div>
      </div>
    );
  };""", """  const renderStepDots = (currentStep) => {
    const totalSteps = 6;
    return (
      <div className={styles.stepDots}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`${styles.dot} ${i + 1 === currentStep ? styles.dotActive : ''}`} 
          />
        ))}
      </div>
    );
  };""")

with open('/home/hassan/Desktop/tot/src/app/app/page.js', 'w') as f:
    f.write(js)
