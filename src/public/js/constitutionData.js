/**
 * Indian Constitution Dataset Manager
 * Fetches and manages data from Hugging Face Indian Constitution dataset
 */

class ConstitutionDataManager {
    constructor() {
        this.baseUrl = 'https://datasets-server.huggingface.co/rows';
        this.dataset = 'Sharathhebbar24/Indian-Constitution';
        this.config = 'default';
        this.split = 'train';
        this.cachedData = null;
        this.allArticles = [];
    }

    /**
     * Fetch constitution data from Hugging Face API
     * @param {number} offset - Starting position
     * @param {number} length - Number of records to fetch
     * @returns {Promise<Object>} - The fetched data
     */
    async fetchData(offset = 0, length = 100) {
        try {
            const url = `${this.baseUrl}?dataset=${encodeURIComponent(this.dataset)}&config=${this.config}&split=${this.split}&offset=${offset}&length=${length}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching constitution data:', error);
            throw error;
        }
    }

    /**
     * Fetch all constitution articles (454 total)
     * @returns {Promise<Array>} - Array of all articles
     */
    async fetchAllArticles() {
        if (this.allArticles.length > 0) {
            return this.allArticles;
        }

        try {
            const totalRows = 454; // Total number of articles
            const batchSize = 100;
            const batches = Math.ceil(totalRows / batchSize);
            
            for (let i = 0; i < batches; i++) {
                const offset = i * batchSize;
                const data = await this.fetchData(offset, batchSize);
                
                if (data.rows && data.rows.length > 0) {
                    const articles = data.rows.map(item => ({
                        id: item.row.article_id,
                        description: item.row.article_desc,
                        index: item.row_idx
                    }));
                    this.allArticles.push(...articles);
                }
            }
            
            // Cache the data in localStorage for offline access
            this.cacheData(this.allArticles);
            
            return this.allArticles;
        } catch (error) {
            console.error('Error fetching all articles:', error);
            // Try to load from cache if fetch fails
            return this.loadFromCache() || [];
        }
    }

    /**
     * Search articles by keyword
     * @param {string} keyword - Search term
     * @returns {Array} - Matching articles
     */
    searchArticles(keyword) {
        if (!keyword || this.allArticles.length === 0) {
            return [];
        }

        const searchTerm = keyword.toLowerCase();
        return this.allArticles.filter(article => 
            article.id.toLowerCase().includes(searchTerm) ||
            article.description.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Get article by number
     * @param {number} articleNumber - Article number (1-454)
     * @returns {Object|null} - Article object or null
     */
    getArticleByNumber(articleNumber) {
        const searchId = `Article ${articleNumber} of Indian Constitution`;
        return this.allArticles.find(article => 
            article.id === searchId
        ) || null;
    }

    /**
     * Get articles by category/topic
     * @param {string} topic - Topic to search for
     * @returns {Array} - Matching articles
     */
    getArticlesByTopic(topic) {
        return this.searchArticles(topic);
    }

    /**
     * Cache data to localStorage
     * @param {Array} data - Data to cache
     */
    cacheData(data) {
        try {
            const cacheObject = {
                data: data,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem('constitutionData', JSON.stringify(cacheObject));
        } catch (error) {
            console.error('Error caching data:', error);
        }
    }

    /**
     * Load data from localStorage cache
     * @returns {Array|null} - Cached data or null
     */
    loadFromCache() {
        try {
            const cached = localStorage.getItem('constitutionData');
            if (cached) {
                const cacheObject = JSON.parse(cached);
                // Cache expires after 7 days
                const cacheAge = Date.now() - cacheObject.timestamp;
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
                
                if (cacheAge < maxAge) {
                    this.allArticles = cacheObject.data;
                    return cacheObject.data;
                }
            }
        } catch (error) {
            console.error('Error loading cached data:', error);
        }
        return null;
    }

    /**
     * Clear cached data
     */
    clearCache() {
        localStorage.removeItem('constitutionData');
        this.allArticles = [];
    }

    /**
     * Get random article
     * @returns {Object|null} - Random article
     */
    getRandomArticle() {
        if (this.allArticles.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * this.allArticles.length);
        return this.allArticles[randomIndex];
    }

    /**
     * Get article statistics
     * @returns {Object} - Statistics about the dataset
     */
    getStatistics() {
        return {
            totalArticles: this.allArticles.length,
            cached: localStorage.getItem('constitutionData') !== null,
            topics: this.extractTopics()
        };
    }

    /**
     * Extract common topics from articles
     * @returns {Array} - Array of common topics
     */
    extractTopics() {
        const topics = [
            'Fundamental Rights',
            'Directive Principles',
            'Citizenship',
            'President',
            'Parliament',
            'Vice President',
            'Council of Ministers',
            'Judiciary',
            'Union Territories',
            'States',
            'Elections',
            'Finance',
            'Trade and Commerce',
            'Emergency Provisions',
            'Amendment',
            'Scheduled Castes',
            'Scheduled Tribes'
        ];
        return topics;
    }

    /**
     * Format article for display
     * @param {Object} article - Article object
     * @returns {string} - Formatted HTML string
     */
    formatArticleHTML(article) {
        if (!article) return '<p>Article not found.</p>';
        
        return `
            <div class="constitution-article">
                <h3 class="article-title">${article.id}</h3>
                <div class="article-content">
                    ${this.formatDescription(article.description)}
                </div>
            </div>
        `;
    }

    /**
     * Format article description with proper line breaks
     * @param {string} description - Article description
     * @returns {string} - Formatted HTML
     */
    formatDescription(description) {
        // Replace newlines with <br> tags and format numbered lists
        return description
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                if (line.match(/^\(\d+\)/)) {
                    return `<p class="article-clause">${line}</p>`;
                } else if (line.match(/^\([a-z]\)/)) {
                    return `<p class="article-subclause">${line}</p>`;
                }
                return `<p>${line}</p>`;
            })
            .join('');
    }
}

// Create a global instance
const constitutionManager = new ConstitutionDataManager();

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        console.log('Loading Indian Constitution data...');
        try {
            // Try to load from cache first
            const cached = constitutionManager.loadFromCache();
            if (!cached) {
                // If no cache, fetch from API
                await constitutionManager.fetchAllArticles();
                console.log('Constitution data loaded successfully');
            } else {
                console.log('Constitution data loaded from cache');
            }
        } catch (error) {
            console.error('Failed to load constitution data:', error);
        }
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConstitutionDataManager, constitutionManager };
}
