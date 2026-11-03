// Browser-safe Supabase URL and publishable key only. Never put a service_role key here.
const SUPABASE_URL = "https://thigwkdxdzfnrfengtef.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_SLzoFUqRBEMN_hAvt58sLA_FEPQ_-dM";
const root=document.documentElement;
const saved=localStorage.getItem("pnm-theme"); if(saved)root.setAttribute("data-theme",saved);
document.getElementById("themeToggle").addEventListener("click",()=>{const next=root.getAttribute("data-theme")==="light"?"dark":"light";root.setAttribute("data-theme",next);localStorage.setItem("pnm-theme",next);});
const modal=document.getElementById("authModal"),form=document.getElementById("authForm"),submit=document.getElementById("authSubmit"),message=document.getElementById("authMessage");
let mode="signup",client=null,currentUser=null,editingGoalId=null;
function say(text,error=false){message.textContent=text;message.style.color=error?"#d97979":"var(--olive)";}
function setMode(next){mode=next;const signup=mode==="signup";document.getElementById("authTitle").textContent=signup?"Create your account":"Welcome back";document.getElementById("authDescription").textContent=signup?"Start building your next chapter.":"Log in to continue your journey.";submit.textContent=signup?"Create account":"Log in";document.getElementById("password").autocomplete=signup?"new-password":"current-password";document.getElementById("switchPrompt").textContent=signup?"Already have an account?":"New to PNM?";document.getElementById("switchAuth").textContent=signup?"Log in":"Create an account";say("");}
function openAuth(next){setMode(next);modal.classList.remove("hidden");document.getElementById("email").focus();}
function closeAuth(){modal.classList.add("hidden");form.reset();say("");}
document.getElementById("openSignup").onclick=()=>openAuth("signup");document.getElementById("heroSignup").onclick=()=>openAuth("signup");document.getElementById("openLogin").onclick=()=>openAuth("login");document.getElementById("closeAuth").onclick=closeAuth;document.getElementById("switchAuth").onclick=()=>setMode(mode==="signup"?"login":"signup");modal.addEventListener("click",e=>{if(e.target===modal)closeAuth();});
function signedIn(user){currentUser=user;document.getElementById("publicContent").classList.add("hidden");document.getElementById("dashboard").classList.remove("hidden");document.getElementById("welcomeText").textContent=`Signed in as ${user.email||"PNM member"}.`;document.getElementById("openSignup").classList.add("hidden");document.getElementById("openLogin").classList.add("hidden");loadGoals();}
function signedOut(){currentUser=null;document.getElementById("publicContent").classList.remove("hidden");document.getElementById("dashboard").classList.add("hidden");document.getElementById("openSignup").classList.remove("hidden");document.getElementById("openLogin").classList.remove("hidden");hideGoalForm();}
const goalForm=document.getElementById("goalForm"),goalMessage=document.getElementById("goalMessage"),goalsList=document.getElementById("goalsList");
function goalSay(text,error=false){goalMessage.textContent=text;goalMessage.style.color=error?"#d97979":"var(--olive)";}
function showGoalForm(goal=null){editingGoalId=goal?.id||null;document.getElementById("goalFormTitle").textContent=goal?"Edit your goal":"Create a goal";document.getElementById("goalTitle").value=goal?.title||"";document.getElementById("goalDescription").value=goal?.description||"";document.getElementById("goalCategory").value=goal?.category||"Learning";document.getElementById("goalDate").value=goal?.target_date||"";document.getElementById("saveGoalButton").textContent=goal?"Save changes":"Save goal";goalSay("");goalForm.classList.remove("hidden");document.getElementById("goalTitle").focus();}
function hideGoalForm(){goalForm.classList.add("hidden");goalForm.reset();editingGoalId=null;goalSay("");}
document.getElementById("showGoalForm").onclick=()=>showGoalForm();document.getElementById("cancelGoal").onclick=hideGoalForm;
function safeDate(date){if(!date)return "No target date";return new Date(`${date}T00:00:00`).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});}
function renderJourney(goals){
 const total=goals.length, completed=goals.filter(g=>Number(g.progress)===100).length;
 const active=total-completed, average=total?Math.round(goals.reduce((sum,g)=>sum+Number(g.progress||0),0)/total):0;
 document.getElementById("journeyTotal").textContent=total;document.getElementById("journeyActive").textContent=active;document.getElementById("journeyCompleted").textContent=completed;document.getElementById("journeyProgress").textContent=average+"%";document.getElementById("journeyProgressLabel").textContent=average+"%";document.getElementById("journeyProgressBar").style.width=average+"%";
 const list=document.getElementById("journeyMilestones");list.replaceChildren();
 if(!total){const empty=document.createElement("p");empty.className="muted";empty.textContent="Your milestones will appear here when you add goals.";list.append(empty);}
 else {const sorted=[...goals].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));for(const goal of sorted){const item=document.createElement("article");item.className="milestone";const marker=document.createElement("span");marker.className="milestone-marker";marker.textContent=Number(goal.progress)===100?"✓":"•";const body=document.createElement("div");body.className="milestone-body";const title=document.createElement("strong");title.textContent=goal.title;const detail=document.createElement("p");detail.textContent=(Number(goal.progress)===100?"Goal completed":"Progress: "+Number(goal.progress||0)+"%")+" · "+goal.category;body.append(title,detail);item.append(marker,body);list.append(item);}}
 renderAchievements(goals);
}
const achievementDefinitions=[
 {icon:"🌱",title:"First Step",description:"Create your first personal goal.",points:10,unlocked:g=>g.length>=1,progress:g=>({current:Math.min(g.length,1),target:1,label:"personal goal"})},
 {icon:"🎯",title:"Goal Setter",description:"Create 3 personal goals.",points:20,unlocked:g=>g.length>=3,progress:g=>({current:Math.min(g.length,3),target:3,label:"goals created"})},
 {icon:"🚀",title:"Halfway Hero",description:"Reach 50% progress on any goal.",points:15,unlocked:g=>g.some(x=>Number(x.progress)>=50),progress:g=>({current:g.some(x=>Number(x.progress)>=50)?1:0,target:1,label:"goal at 50% progress"})},
 {icon:"🏁",title:"Finisher",description:"Complete your first goal.",points:30,unlocked:g=>g.some(x=>Number(x.progress)===100),progress:g=>({current:Math.min(g.filter(x=>Number(x.progress)===100).length,1),target:1,label:"goal completed"})},
 {icon:"🏆",title:"Consistency Builder",description:"Complete 3 personal goals.",points:50,unlocked:g=>g.filter(x=>Number(x.progress)===100).length>=3,progress:g=>({current:Math.min(g.filter(x=>Number(x.progress)===100).length,3),target:3,label:"goals completed"})}
];
function renderAchievements(goals){
 const grid=document.getElementById("achievementGrid");if(!grid)return;grid.replaceChildren();let points=0;
 for(const badge of achievementDefinitions){
  const earned=badge.unlocked(goals);if(earned)points+=badge.points;
  const card=document.createElement("article");card.className="achievement-card"+(earned?"":" locked");
  const icon=document.createElement("span");icon.className="achievement-icon";icon.textContent=earned?badge.icon:"🔒";
  const body=document.createElement("div");body.className="achievement-body";
  const title=document.createElement("h3");title.textContent=badge.title;
  const description=document.createElement("p");description.textContent=earned?"Unlocked — "+badge.description:badge.description;
  const score=document.createElement("span");score.className="achievement-points";score.textContent=(earned?"+":"")+badge.points+" points";
  body.append(title,description,score);
  if(!earned){const status=badge.progress(goals);const progressText=document.createElement("p");progressText.className="achievement-progress-text";progressText.textContent=status.current+" / "+status.target+" "+status.label;const track=document.createElement("div");track.className="achievement-progress";const fill=document.createElement("span");fill.style.width=Math.round(status.current/status.target*100)+"%";track.append(fill);body.append(progressText,track);}
  card.append(icon,body);grid.append(card);
 }
 document.getElementById("achievementPoints").textContent=points;
}
function renderGoals(goals){if(!goals.length){goalsList.innerHTML='<div class="goal-empty"><strong>No goals yet.</strong><br>Add your first goal and start building your journey.</div>';return;}goalsList.replaceChildren();for(const goal of goals){const card=document.createElement("article");card.className="goal-card";const top=document.createElement("div");top.className="goal-top";const info=document.createElement("div");const title=document.createElement("h3");title.textContent=goal.title;const meta=document.createElement("div");meta.className="goal-meta";meta.textContent=`${goal.category} · ${safeDate(goal.target_date)}`;info.append(title,meta);const status=document.createElement("span");status.className="goal-status";status.textContent=goal.progress===100?"COMPLETED":"IN PROGRESS";top.append(info,status);card.append(top);if(goal.description){const desc=document.createElement("p");desc.className="goal-description";desc.textContent=goal.description;card.append(desc);}const progressRow=document.createElement("div");progressRow.className="goal-progress-row";const range=document.createElement("input");range.type="range";range.min="0";range.max="100";range.step="5";range.value=goal.progress;range.setAttribute("aria-label",`Progress for ${goal.title}`);const percent=document.createElement("strong");percent.textContent=`${goal.progress}%`;range.addEventListener("change",()=>updateProgress(goal.id,Number(range.value)));range.addEventListener("input",()=>percent.textContent=`${range.value}%`);progressRow.append(range,percent);card.append(progressRow);const bar=document.createElement("div");bar.className="goal-bar";const fill=document.createElement("span");fill.style.width=`${goal.progress}%`;bar.append(fill);card.append(bar);const actions=document.createElement("div");actions.className="goal-actions";const edit=document.createElement("button");edit.className="secondary";edit.textContent="Edit";edit.onclick=()=>showGoalForm(goal);const remove=document.createElement("button");remove.className="secondary";remove.textContent="Delete";remove.onclick=()=>deleteGoal(goal.id);actions.append(edit,remove);card.append(actions);goalsList.append(card);}}
async function loadGoals(){if(!client||!currentUser)return;goalsList.innerHTML='<p class="muted">Loading your goals…</p>';const{data,error}=await client.from("goals").select("id,title,description,category,target_date,progress,created_at").order("created_at",{ascending:false});if(error){goalsList.innerHTML='<div class="goal-empty">Could not load goals. Check that the database setup is complete.</div>';console.error("PNM load goals:",error.message);return;}renderGoals(data||[]);renderJourney(data||[]);}
goalForm.addEventListener("submit",async e=>{e.preventDefault();if(!client||!currentUser)return;const payload={title:document.getElementById("goalTitle").value.trim(),description:document.getElementById("goalDescription").value.trim()||null,category:document.getElementById("goalCategory").value,target_date:document.getElementById("goalDate").value||null};if(!payload.title){goalSay("Please enter a goal name.",true);return;}const save=document.getElementById("saveGoalButton");save.disabled=true;save.textContent="Saving…";goalSay("");try{let result;if(editingGoalId)result=await client.from("goals").update(payload).eq("id",editingGoalId).select();else result=await client.from("goals").insert(payload).select();if(result.error)throw result.error;hideGoalForm();await loadGoals();}catch(err){goalSay(err.message||"Could not save this goal.",true);}finally{save.disabled=false;save.textContent=editingGoalId?"Save changes":"Save goal";}});
async function updateProgress(id,progress){const{error}=await client.from("goals").update({progress}).eq("id",id);if(error){alert("Could not update progress: "+error.message);loadGoals();}else loadGoals();}
async function deleteGoal(id){if(!confirm("Delete this goal? This cannot be undone."))return;const{error}=await client.from("goals").delete().eq("id",id);if(error){alert("Could not delete goal: "+error.message);return;}loadGoals();}
if(window.supabase&&window.supabase.createClient){client=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);form.addEventListener("submit",async e=>{e.preventDefault();const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;submit.disabled=true;submit.textContent="Please wait…";say("");try{if(mode==="signup"){const{data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:"https://frolicking-dragon-92c789.netlify.app/"}});if(error)throw error;if(data.session){closeAuth();signedIn(data.user);}else say("Check your email for a confirmation link. After confirming, come back and log in.");}else{const{data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;closeAuth();signedIn(data.user);}}catch(err){say(err.message||"Something went wrong. Please try again.",true);}finally{submit.disabled=false;submit.textContent=mode==="signup"?"Create account":"Log in";}});document.getElementById("logoutButton").onclick=async()=>{const{error}=await client.auth.signOut();if(error){alert(error.message);return;}signedOut();};client.auth.getSession().then(({data})=>{if(data.session?.user)signedIn(data.session.user);});client.auth.onAuthStateChange((_event,session)=>{if(session?.user)signedIn(session.user);else signedOut();});}else{document.getElementById("openSignup").onclick=()=>alert("Authentication library did not load. Check your internet connection and refresh.");document.getElementById("openLogin").onclick=()=>alert("Authentication library did not load. Check your internet connection and refresh.");}
/* =================================
   PNM SIDEBAR — MENU CONTROLS
================================= */

(() => {
  function initPNMSidebar() {
    const sidebar = document.getElementById("pnmSidebar");
    const menuButton = document.getElementById("pnmMenuToggle");
    const closeButton = document.getElementById("pnmSidebarClose");
    const backdrop = document.getElementById("pnmSidebarBackdrop");
    const themeButton = document.getElementById("pnmThemeToggle");

    if (!sidebar || !menuButton || sidebar.dataset.ready) return;
    sidebar.dataset.ready = "true";

    function openSidebar() {
      document.body.classList.add("pnm-sidebar-open");

      if (backdrop) {
        backdrop.style.pointerEvents =
          window.matchMedia("(max-width: 850px)").matches
            ? "auto"
            : "none";
      }

      menuButton.setAttribute("aria-expanded", "true");
    }

    function closeSidebar() {
      document.body.classList.remove("pnm-sidebar-open");
      menuButton.setAttribute("aria-expanded", "false");
    }

    menuButton.addEventListener("click", openSidebar);

    if (closeButton) {
      closeButton.addEventListener("click", closeSidebar);
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeSidebar);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeSidebar();
    });

    sidebar.querySelectorAll(".pnm-side-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 850px)").matches) {
          closeSidebar();
        }
      });
    });

    // Dark / Light theme
    if (themeButton) {
      themeButton.addEventListener("click", () => {
        const root = document.documentElement;

        const currentTheme =
          root.getAttribute("data-theme") ||
          localStorage.getItem("pnm-theme") ||
          "dark";

        const nextTheme =
          currentTheme === "dark" ? "light" : "dark";

        root.setAttribute("data-theme", nextTheme);
        localStorage.setItem("pnm-theme", nextTheme);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPNMSidebar);
  } else {
    initPNMSidebar();
  }
})();
