    const SUPABASE_CONFIG = {
        url: 'https://btwykwtvstjhgchldwez.supabase.co',
        key: 'sb_publishable_GJL_9tAXvcsTXA2nOQEHPA_2r9JSfFY',
        options: {
            headers: {
                'apikey': 'sb_publishable_GJL_9tAXvcsTXA2nOQEHPA_2r9JSfFY',
                'Authorization': 'Bearer sb_publishable_GJL_9tAXvcsTXA2nOQEHPA_2r9JSfFY'
            },
            db: {
                schema: 'public'
            },
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        }
    };

    let supabaseClient;

function initializeSupabase() {
    try {
        // 确保 Supabase 库已加载
        if (typeof supabase === 'undefined') {
            console.error('Supabase库未加载');
            return false;
        }
        
        supabaseClient = supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.key,
            SUPABASE_CONFIG.options
        );
        console.log('Supabase初始化成功');
        return true;
    } catch (error) {
        console.error('Supabase初始化失败:', error);
        return false;
    }
}

    const utils = {

        updateAvatarDisplay: (avatarUrl) => {
    // 更新登录状态中的头像
    const loggedInDiv = document.querySelector('.logged-in img');
    if (loggedInDiv) {
        loggedInDiv.src = avatarUrl || 'https://via.placeholder.com/30x30?text=头像';
    }
    
    // 更新设置中的预览
    const avatarPreview = document.getElementById('avatar-preview');
    if (avatarPreview) {
        avatarPreview.src = avatarUrl || 'https://via.placeholder.com/60x60?text=头像';
    }
},

        getCurrentYear: () => new Date().getFullYear(),
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        formatDate: (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        showLoading: (elementId) => {
            const element = document.getElementById(elementId);
            if (element) element.style.display = 'block';
        },
        hideLoading: (elementId) => {
            const element = document.getElementById(elementId);
            if (element) element.style.display = 'none';
        },
        showDialog: (callback) => {
            document.getElementById('confirmationDialog').style.display = 'flex';
            
            document.getElementById('dialogConfirm').onclick = () => {
                document.getElementById('confirmationDialog').style.display = 'none';
                if (callback) callback(true);
            };
            
            document.getElementById('dialogCancel').onclick = () => {
                document.getElementById('confirmationDialog').style.display = 'none';
                if (callback) callback(false);
            };
        },

setAuthStatus: (username) => {
    const authStatus = document.getElementById('authStatus');
    if (username) {
        // 生成头像首字母
        const avatarLetter = username.charAt(0).toUpperCase();
        authStatus.innerHTML = `
            <div class="logged-in">
                <div style="width: 30px; height: 30px; border-radius: 50%; background: #00a1d6; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0;">
                    ${avatarLetter}
                </div>
                <span style="margin: 0 5px;">${username}</span>
                <button class="settings-btn" id="settingsBtn" style="background: none; border: none; color: #999; cursor: pointer; padding: 0 5px;">
                    <i class="fas fa-cog"></i>
                </button>
                <button class="logout-btn" id="logoutBtn" style="background: none; border: none; color: #999; cursor: pointer; padding: 0 5px;">
                    登出
                </button>
            </div>
        `;
        // 重新绑定事件
        setTimeout(() => {
            document.getElementById('logoutBtn')?.addEventListener('click', app.logout);
            document.getElementById('settingsBtn')?.addEventListener('click', () => {
                app.showSettings();
            });
        }, 0);
        // 显示签到按钮
        const checkinBtn = document.getElementById('checkinBtn');
        if (checkinBtn) {
            checkinBtn.style.display = 'flex';
        }
// 检查签到状态（如果页面定义了该方法）
if (typeof app.checkCheckinStatus === 'function') {
    app.checkCheckinStatus();
}
    } else {
        authStatus.innerHTML = '<button id="authBtn" class="auth-btn">登录/注册</button>';
        document.getElementById('authBtn')?.addEventListener('click', () => app.showAuthModal());
        // 隐藏签到按钮
        const checkinBtn = document.getElementById('checkinBtn');
        if (checkinBtn) {
            checkinBtn.style.display = 'none';
        }
        const voteBadge = document.getElementById('voteCountBadge');
        if (voteBadge) {
            voteBadge.style.display = 'none';
        }
    }
},
        getAuthToken: () => localStorage.getItem('authToken'),
        setAuthToken: (token) => localStorage.setItem('authToken', token),
        removeAuthToken: () => localStorage.removeItem('authToken'),
        getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser')),
        setCurrentUser: (user) => localStorage.setItem('currentUser', JSON.stringify(user)),
        removeCurrentUser: () => localStorage.removeItem('currentUser'),
    getLastCheckinDate: () => {
        const user = utils.getCurrentUser();
        return user ? localStorage.getItem(`lastCheckinDate_${user.id}`) : null;
    },
    setLastCheckinDate: (date) => {
        const user = utils.getCurrentUser();
        if (user) localStorage.setItem(`lastCheckinDate_${user.id}`, date);
    },
    getVoteCount: () => {
        const user = utils.getCurrentUser();
        return user ? parseInt(localStorage.getItem(`voteCount_${user.id}`) || '0') : 0;
    },
    setVoteCount: (count) => {
        const user = utils.getCurrentUser();
        if (user) localStorage.setItem(`voteCount_${user.id}`, count.toString());
    },
    incrementVoteCount: () => {
        const count = utils.getVoteCount() + 1;
        utils.setVoteCount(count);
        return count;
    },
isSameDay: (date1, date2) => {
    return date1 === date2; // 直接比较字符串
},
compressImage: (file, maxWidth = 800, maxHeight = 800, quality = 0.7, isAvatar = false) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                // 计算缩放比例，保持宽高比
                let width = img.width;
                let height = img.height;
                
                // 头像使用固定尺寸
                if (isAvatar) {
                    width = 100;
                    height = 100;
                } else {
                    // 普通图片，限制最大尺寸但保持比例
                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round(height * (maxWidth / width));
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round(width * (maxHeight / height));
                            height = maxHeight;
                        }
                    }
                }
                
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                // 设置白色背景（防止透明背景变黑）
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);
                
                // 压缩质量
                const compressedQuality = isAvatar ? 0.6 : quality;
                const compressedDataUrl = canvas.toDataURL('image/jpeg', compressedQuality);
                
                // 生成缩略图
                const thumbCanvas = document.createElement('canvas');
                const thumbSize = isAvatar ? 50 : 200;
                thumbCanvas.width = thumbSize;
                thumbCanvas.height = thumbSize;
                const thumbCtx = thumbCanvas.getContext('2d');
                thumbCtx.fillStyle = '#FFFFFF';
                thumbCtx.fillRect(0, 0, thumbSize, thumbSize);
                
                // 计算缩略图比例
                let thumbWidth, thumbHeight;
                if (img.width > img.height) {
                    thumbWidth = thumbSize;
                    thumbHeight = Math.round(img.height * (thumbSize / img.width));
                } else {
                    thumbHeight = thumbSize;
                    thumbWidth = Math.round(img.width * (thumbSize / img.height));
                }
                const thumbX = (thumbSize - thumbWidth) / 2;
                const thumbY = (thumbSize - thumbHeight) / 2;
                thumbCtx.drawImage(img, thumbX, thumbY, thumbWidth, thumbHeight);
                
                const thumbDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.5);
                
                resolve({
                    full: compressedDataUrl,
                    thumb: thumbDataUrl
                });
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
},




    async saveUserAvatar(userId, file) {
    if (!supabaseClient) return false;
    
    try {
        const compressed = await this.compressImage(file, 200, 200, 0.6, true);
        
        // 检查是否已有头像
        const { data: existing } = await supabaseClient
            .from('user_avatars')
            .select('id')
            .eq('user_id', userId)
            .single();
        
        if (existing) {
            // 更新
            const { error } = await supabaseClient
                .from('user_avatars')
                .update({
                    avatar_data: compressed.full,
                    avatar_thumb: compressed.thumb,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);
            
            if (error) throw error;
        } else {
            // 插入
            const { error } = await supabaseClient
                .from('user_avatars')
                .insert([{
                    user_id: userId,
                    avatar_data: compressed.full,
                    avatar_thumb: compressed.thumb
                }]);
            
            if (error) throw error;
        }
        
        // 更新本地存储
        const user = this.getCurrentUser();
        user.avatar_thumb = compressed.thumb;
        this.setCurrentUser(user);
        
        // 更新界面
        this.updateAvatarDisplay(compressed.thumb);
        
        return true;
    } catch (error) {
        console.error('保存头像失败:', error);
        return false;
    }
},

updateAvatarDisplay(avatarUrl) {
    // 更新所有显示头像的地方
    document.querySelectorAll('.user-avatar').forEach(el => {
        el.src = avatarUrl || 'https://via.placeholder.com/40x40?text=头像';
    });
},

getCurrentSettings: () => {
    const user = utils.getCurrentUser();
    if (user) {
        const saved = localStorage.getItem(`userSettings_${user.id}`);
        if (saved) return JSON.parse(saved);
    }
    return {};
},

applySettings: (settings) => {
    if (!settings) return;
    // 背景颜色
    if (settings.bgColor) {
        document.body.style.backgroundColor = settings.bgColor;
    } else {
        document.body.style.backgroundColor = '#f5f5f5';
    }
    // 背景图片
    if (settings.bgImageUrl && settings.bgImageUrl.trim() !== '') {
        document.body.style.backgroundImage = `url('${settings.bgImageUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
    } else {
        document.body.style.backgroundImage = '';
    }
    // 背景模糊
    if (settings.bgBlur) {
        document.body.style.backdropFilter = `blur(${settings.bgBlur}px)`;
    } else {
        document.body.style.backdropFilter = '';
    }
    // 头部
    const header = document.querySelector('header');
    if (header) {
        header.style.backgroundColor = `rgba(255, 255, 255, ${settings.headerOpacity || 1})`;
        header.style.backdropFilter = settings.headerOpacity < 1 ? 'blur(5px)' : 'none';
    }
    // 主内容区域（不同页面类名不同）
    const mainContent = document.querySelector('.main-content, .detail-page, .post-content, .manage-panel, .forum-view');
    if (mainContent) {
        mainContent.style.backgroundColor = `rgba(255, 255, 255, ${settings.mainOpacity || 1})`;
        mainContent.style.backdropFilter = settings.mainOpacity < 1 ? 'blur(5px)' : 'none';
    }
    // 留言板/侧边栏
    const commentsPanel = document.querySelector('.comments-panel, .sidebar, .detail-comments, .comments-section');
    if (commentsPanel) {
        commentsPanel.style.backgroundColor = `rgba(255, 255, 255, ${settings.commentsOpacity || 1})`;
        commentsPanel.style.backdropFilter = settings.commentsOpacity < 1 ? 'blur(5px)' : 'none';
    }
    // 卡片（仅适用于 index.html）
    const cards = document.querySelectorAll('.candidate-card');
    cards.forEach(card => {
        card.style.backgroundColor = `rgba(255, 255, 255, ${settings.cardOpacity || 1})`;
        card.style.backdropFilter = settings.cardOpacity < 1 ? 'blur(5px)' : 'none';
    });
}

    };

const dataService = {
    currentPage: 1,
    itemsPerPage: 9,
    totalItems: 0,
    searchTerm: '',

    // 在 dataService 对象内部添加
allForumPosts: [], // 用于缓存所有帖子

async loadAllForumPosts() {
    if (!supabaseClient) return [];
    try {
        const { data: posts, error } = await supabaseClient
            .from('forum_posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        this.allForumPosts = posts || [];
        return this.allForumPosts;
    } catch (error) {
        console.error('获取所有帖子失败:', error);
        return [];
    }
},

getFilteredPosts(searchTerm, sortBy) {
    let posts = [...this.allForumPosts];
    
    // 搜索过滤
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        posts = posts.filter(p => 
            (p.title && p.title.toLowerCase().includes(term)) || 
            (p.content && p.content.toLowerCase().includes(term))
        );
    }
    
    // 排序
    if (sortBy === 'likes') {
        posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
        // 默认时间倒序
        posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    return posts;
},
    
    async getCandidates(page = 1) {
        if (!supabaseClient) return [];
        
        try {
            // 首先获取所有候选人和他们的票数
            const { data: votesData, error: votesError } = await supabaseClient
                .from('votes')
                .select('candidate_id');
            
            if (votesError) throw votesError;
            
            // 计算每个候选人的票数
            const voteCounts = {};
            (votesData || []).forEach(v => {
                voteCounts[v.candidate_id] = (voteCounts[v.candidate_id] || 0) + 1;
            });
            
            // 获取候选人数据并按票数排序
            let query = supabaseClient
                .from('candidates')
                .select('*', { count: 'exact' });
            
            if (this.searchTerm) {
                query = query.or(`name.ilike.%${this.searchTerm}%,description.ilike.%${this.searchTerm}%`);
            }
            
            const { data, count, error } = await query;
            
            if (error) throw error;
            
            // 为每个候选人添加票数并排序
            const candidatesWithVotes = (data || []).map(candidate => ({
                ...candidate,
                votes: voteCounts[candidate.id] || 0
            })).sort((a, b) => b.votes - a.votes);
            
            this.totalItems = count;
            this.currentPage = page;
            
            // 分页处理
            const offset = (page - 1) * this.itemsPerPage;
            return candidatesWithVotes.slice(offset, offset + this.itemsPerPage);
        } catch (error) {
            console.error('获取候选人失败:', error);
            return [];
        }
    },
    
    
    async getCandidateDetail(id) {
        if (!supabaseClient) return null;
        
        try {
            const { data, error } = await supabaseClient
                .from('candidates')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('获取候选人详情失败:', error);
            return null;
        }
    },
    
    async getVotes() {
        if (!supabaseClient) return {};
        
        try {
            const { data, error } = await supabaseClient
                .from('votes')
                .select('candidate_id');
            
            if (error) throw error;
            
            const counts = {};
            (data || []).forEach(v => {
                counts[v.candidate_id] = (counts[v.candidate_id] || 0) + 1;
            });
            return counts;
        } catch (error) {
            console.error('获取票数失败:', error);
            return {};
        }
    },
    
    async getComments(candidateId = null) {
        if (!supabaseClient) return [];
        
        try {
            let query = supabaseClient
                .from('comments')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (candidateId) {
                query = query.eq('candidate_id', candidateId);
            } else {
                query = query.is('candidate_id', null);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('获取留言失败:', error);
            return [];
        }
    },
    
    async getLatestComments(limit = 10) {
        try {
            const { data, error } = await supabaseClient
                .from('comments')
                .select('*')
                .is('candidate_id', null)
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('获取最新留言失败:', error);
            return [];
        }
    },
    
async submitVote(candidateId) {
    if (!supabaseClient) return false;
    const user = utils.getCurrentUser();
    if (!user) {
        alert('请先登录后再投票');
        return false;
    }

    try {
        // 获取今天的日期范围
        const today = new Date().toISOString().split('T')[0]; // 例如 "2026-02-27"
        const startOfDay = today + 'T00:00:00.000Z';
        const endOfDay = today + 'T23:59:59.999Z';

        // 检查今天是否已经投过该候选人
        const { data: existingVote, error: checkError } = await supabaseClient
            .from('votes')
            .select('id')
            .eq('candidate_id', candidateId)
            .eq('user_id', user.id)
            .gte('created_at', startOfDay)
            .lte('created_at', endOfDay)
            .maybeSingle();

        if (checkError) throw checkError;
        if (existingVote) {
            alert('您今天已经为该候选人投过票了，请明天再来！');
            return false;
        }

        // 插入投票记录
        const { error: insertError } = await supabaseClient
            .from('votes')
            .insert([{
                candidate_id: candidateId,
                user_id: user.id,
                created_at: new Date().toISOString()
            }]);

        if (insertError) throw insertError;

        // 扣除一次投票机会（可选，根据您的设计）
        const currentCount = utils.getVoteCount();
        if (currentCount > 0) {
            utils.setVoteCount(currentCount - 1);
        }

        return true;
    } catch (error) {
        console.error('投票失败:', error);
        alert('投票失败: ' + (error.message || '未知错误'));
        return false;
    }
},
    
    async submitComment(candidateId, userName, content) {
        if (!supabaseClient) return false;
        if (!userName || !content) return false;
        
        try {
            const { error } = await supabaseClient
                .from('comments')
                .insert([{
                    candidate_id: candidateId,
                    user_name: userName,
                    content: content
                }]);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('提交留言失败:', error);
            alert('提交留言失败: ' + error.message);
            return false;
        }
    },
    
async login(username, password) {
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();
        
        if (error) throw error;
        if (!data) throw new Error('用户名或密码错误');
        
        // 直接使用 data.id，不要转换
        const user = {
            id: data.id,  // 保持UUID格式
            username: data.username,
            password: data.password
        };
        
        const fakeToken = `fake-jwt-token-${Date.now()}`;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', fakeToken);
        
        return { user, token: fakeToken };
    } catch (error) {
        console.error('登录失败:', error);
        throw error;
    }
    // 检查签到状态
this.checkCheckinStatus();
},
    
    async register(username, password) {
        try {
            // 检查用户名是否已存在
            const { data: existingUser } = await supabaseClient
                .from('users')
                .select('username')
                .eq('username', username)
                .single();
            
            if (existingUser) throw new Error('用户名已存在');
            
            // 创建新用户 - 让数据库自动生成UUID
            const { data, error } = await supabaseClient
                .from('users')
                .insert([{ username, password }])
                .select()
                .single();
            
            if (error) throw error;
            
            // 保存用户信息
            const user = {
                id: data.id,  // 数据库生成的UUID
                username: data.username,
                password: data.password
            };
            
            const fakeToken = `fake-jwt-token-${Date.now()}`;
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('authToken', fakeToken);
            
            return { user, token: fakeToken };
        } catch (error) {
            console.error('注册失败:', error);
            throw error;
        }
        // 检查签到状态
this.checkCheckinStatus();
    },

    async getForumPosts() {
        if (!supabaseClient) return [];
        
        try {
            const { data, error } = await supabaseClient
                .from('forum_posts')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('获取论坛帖子失败:', error);
            return [];
        }
    },

    async getForumPost(postId) {
    if (!supabaseClient) return null;
    try {
        const { data, error } = await supabaseClient
            .from('forum_posts')
            .select('*')
            .eq('id', postId)
            .single();
        if (error) throw error;
        
        // 更新浏览量
        await supabaseClient
            .from('forum_posts')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', postId);
        
        return data;
    } catch (error) {
        console.error('获取帖子失败:', error);
        return null;
    }
},

async getPostImages(postId) {
    if (!supabaseClient) return [];
    try {
        const { data, error } = await supabaseClient
            .from('forum_images')
            .select('*')
            .eq('post_id', postId)
            .order('sort_order');
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('获取图片失败:', error);
        return [];
    }
},

async hasUserLikedPost(postId, userId) {
    if (!supabaseClient || !userId) return false;
    try {
        const { data, error } = await supabaseClient
            .from('post_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) throw error;
        return !!data;
    } catch (error) {
        console.error('检查点赞失败:', error);
        return false;
    }
},

async toggleLike(postId, userId) {
    if (!supabaseClient || !userId) return;
    try {
        const liked = await this.hasUserLikedPost(postId, userId);
        if (liked) {
            // 取消点赞
            const { error } = await supabaseClient
                .from('post_likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', userId);
            if (error) throw error;
            // 更新 forum_posts 的 likes 字段 -1
            await supabaseClient.rpc('decrement_likes', { row_id: postId });
            return { liked: false, action: 'unliked' };
        } else {
            // 点赞
            const { error } = await supabaseClient
                .from('post_likes')
                .insert([{ post_id: postId, user_id: userId }]);
            if (error) throw error;
            // 更新 forum_posts 的 likes 字段 +1
            await supabaseClient.rpc('increment_likes', { row_id: postId });
            return { liked: true, action: 'liked' };
        }
    } catch (error) {
        console.error('切换点赞失败:', error);
        throw error;
    }
},

async getPostLikesCount(postId) {
    if (!supabaseClient) return 0;
    try {
        const { count, error } = await supabaseClient
            .from('post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId);
        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('获取点赞数失败:', error);
        return 0;
    }
},
    
    async createForumPost(title, content, userId, userName, imageCount = 0) {
        if (!supabaseClient) return false;
        
        try {
            // 从 localStorage 获取当前用户
            const userStr = localStorage.getItem('currentUser');
            if (!userStr) {
                alert('用户未登录');
                return false;
            }
            
            const user = JSON.parse(userStr);
            
            // 直接使用用户的UUID字符串
            const userIdStr = user.id;
            
            console.log('创建帖子 - 用户ID:', userIdStr, '类型:', typeof userIdStr);
            
            // 生成帖子ID
            const postId = crypto.randomUUID ? crypto.randomUUID() : 
                           'post-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            
            // 创建帖子数据 - 直接使用UUID字符串
            const postData = {
                id: postId,
                title: title || '无标题',
                content: content || '',
                user_id: userIdStr,  // 直接使用UUID字符串
                user_name: user.username || userName || '匿名用户',
                created_at: new Date().toISOString(),
                views: 0,
                comments: 0,
                likes: 0,
                image_count: imageCount || 0
            };
            
            console.log('正在创建帖子:', postData);
            
            const { data, error } = await supabaseClient
                .from('forum_posts')
                .insert([postData])
                .select();
            
            if (error) {
                console.error('数据库错误:', error);
                alert('发布失败：' + error.message);
                return false;
            }
            
            console.log('帖子创建成功:', data);
            return postId;
        } catch (error) {
            console.error('创建论坛帖子失败:', error);
            alert('发布失败：' + error.message);
            return false;
        }
    },

    async savePostImages(postId, images) {
        if (!supabaseClient) return false;
        
        try {
            const imageRecords = images.map((img, index) => ({
                post_id: postId,
                image_data: img.full,
                image_thumb: img.thumb,
                sort_order: index
            }));
            
            const { error } = await supabaseClient
                .from('forum_images')
                .insert(imageRecords);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('保存图片失败:', error);
            return false;
        }
    },

    async getForumPostImages(postId) {
        if (!supabaseClient) return [];
        
        try {
            const { data, error } = await supabaseClient
                .from('forum_images')
                .select('*')
                .eq('post_id', postId)
                .order('sort_order');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('获取帖子图片失败:', error);
            return [];
        }
    },
    
    async addPostComment(postId, userId, userName, content) {
        if (!supabaseClient) return false;
        
        try {
            const { error } = await supabaseClient
                .from('post_comments')
                .insert([{
                    post_id: postId,
                    user_id: userId,
                    user_name: userName,
                    content: content,
                    created_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
            
            // 获取当前评论数
            const { data: postData } = await supabaseClient
                .from('forum_posts')
                .select('comments')
                .eq('id', postId)
                .single();
            
            // 更新评论数
            await supabaseClient
                .from('forum_posts')
                .update({ comments: (postData?.comments || 0) + 1 })
                .eq('id', postId);
            
            return true;
        } catch (error) {
            console.error('添加评论失败:', error);
            return false;
        }
    },

    async getPostComments(postId) {
        if (!supabaseClient) return [];
        
        try {
            const { data, error } = await supabaseClient
                .from('post_comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('获取评论失败:', error);
            return [];
        }
    },

    
    
    getTotalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    
    updatePagination() {
        const totalPages = this.getTotalPages();
        const pageInfo = `第 ${this.currentPage} 页，共 ${totalPages} 页`;
        
        document.getElementById('pageInfo').textContent = pageInfo;
        document.getElementById('pageInfoBottom').textContent = pageInfo;
        
        document.getElementById('prevPage').disabled = this.currentPage <= 1;
        document.getElementById('prevPageBottom').disabled = this.currentPage <= 1;
        document.getElementById('nextPage').disabled = this.currentPage >= totalPages;
        document.getElementById('nextPageBottom').disabled = this.currentPage >= totalPages;
    },

    async getBlogComments() {
    if (!supabaseClient) return [];
    try {
        const { data, error } = await supabaseClient.from('blog_comments').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('获取博客留言失败:', error);
        return [];
    }
},

async addBlogComment(userName, content, imageData = null) {
    if (!supabaseClient) return false;
    try {
        const { error } = await supabaseClient.from('blog_comments').insert([{ user_name: userName, content: content, image_data: imageData, created_at: new Date().toISOString() }]);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('添加博客留言失败:', error);
        return false;
    }
},

async getBlogProfile() {
    if (!supabaseClient) return null;
    try {
        const { data, error } = await supabaseClient.from('blog_profile').select('*').eq('id', 1).single();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('获取博客资料失败:', error);
        return null;
    }
},

async getAnnouncement() {
    if (!supabaseClient) return null;
    try {
        const { data, error } = await supabaseClient
            .from('announcements')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('获取公告失败:', error);
        return null;
    }
},

async submitMusic(submission) {
    if (!supabaseClient) return false;
    try {
        const { error } = await supabaseClient.from('music_submissions').insert([submission]);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('投稿失败:', error);
        return false;
    }
},

async getSystemImages() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient.from('blog_comments').select('user_name, image_data, created_at').not('image_data', 'is', null).order('created_at', { ascending: false }).limit(30);
    if (error) {
        console.error('获取系统图像失败', error);
        return [];
    }
    return data || [];
},

async getSystemSongs() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient.from('music_songs').select('*').order('sort_order');
    if (error) {
        console.error('获取系统音频失败', error);
        return [];
    }
    return data || [];
},
    
};