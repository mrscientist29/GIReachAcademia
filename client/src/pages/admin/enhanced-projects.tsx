import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Users, Calendar, Clock, X } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import type { EnhancedProject, ProjectTask } from "@shared/project-types";

export default function EnhancedProjects() {
    const [projects, setProjects] = useState<EnhancedProject[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingProject, setEditingProject] = useState<EnhancedProject | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form data for enhanced project
    const [formData, setFormData] = useState({
        // Basic Information
        title: "",
        description: "",
        projectType: "meta-analysis" as const,
        status: "accepting-mentees" as const,
        
        // Project Details
        specialty: "",
        leadMentor: "",
        projectLead: "",
        collaboration: "",
        priorityLevel: "medium-impact" as const,
        expectedOutcome: "",
        
        // Logistics
        totalRoles: 12,
        deadline: "",
        
        // Advanced Details
        methodology: "",
        timeline: "",
        authorshipCriteria: "",
        
        // Skills and Resources
        skillsToLearn: [] as string[],
        readingMaterials: [] as string[],
        templateForms: [] as string[],
        teamMembers: [] as string[]
    });

    // Task management
    const [tasks, setTasks] = useState<ProjectTask[]>([]);
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
    const [taskFormData, setTaskFormData] = useState({
        title: "",
        description: "",
        slotsTotal: 2,
        timeCommitment: "",
        level: "Beginner" as const,
        teachingVideoUrl: "",
        supervisorName: "",
        deliverable: "",
        deadline: "",
        requirements: [] as string[]
    });

    // Load sample projects initially
    useEffect(() => {
        // In a real app, this would fetch from API
        setProjects([]);
    }, []);

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            projectType: "meta-analysis",
            status: "accepting-mentees",
            specialty: "",
            leadMentor: "",
            projectLead: "",
            collaboration: "",
            priorityLevel: "medium-impact",
            expectedOutcome: "",
            totalRoles: 12,
            deadline: "",
            methodology: "",
            timeline: "",
            authorshipCriteria: "",
            skillsToLearn: [],
            readingMaterials: [],
            templateForms: [],
            teamMembers: []
        });
        setTasks([]);
    };

    const resetTaskForm = () => {
        setTaskFormData({
            title: "",
            description: "",
            slotsTotal: 2,
            timeCommitment: "",
            level: "Beginner",
            teachingVideoUrl: "",
            supervisorName: "",
            deliverable: "",
            deadline: "",
            requirements: []
        });
    };

    const handleCreateProject = () => {
        setEditingProject(null);
        resetForm();
        setShowCreateDialog(true);
    };

    const handleEditProject = (project: EnhancedProject) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.overview,
            projectType: project.projectType,
            status: project.status,
            specialty: project.specialty,
            leadMentor: project.leadMentor,
            projectLead: project.projectLead,
            collaboration: project.collaboration,
            priorityLevel: project.priorityLevel,
            expectedOutcome: project.expectedOutcome,
            totalRoles: project.totalRoles,
            deadline: project.deadline,
            methodology: project.methodology || "",
            timeline: project.timeline || "",
            authorshipCriteria: project.authorshipCriteria || "",
            skillsToLearn: project.skillsToLearn,
            readingMaterials: project.readingMaterials || [],
            templateForms: project.templateForms || [],
            teamMembers: project.teamMembers || []
        });
        setTasks(project.tasks);
        setShowCreateDialog(true);
    };

    const handleSubmitProject = async (e: React.FormEvent) => {
        e.preventDefault();

        const projectData: EnhancedProject = {
            id: editingProject?.id || `project-${Date.now()}`,
            title: formData.title,
            specialty: formData.specialty,
            leadMentor: formData.leadMentor,
            projectLead: formData.projectLead,
            collaboration: formData.collaboration,
            projectType: formData.projectType,
            status: formData.status,
            openRoles: formData.totalRoles, // Initially all roles are open
            totalRoles: formData.totalRoles,
            deadline: formData.deadline,
            expectedOutcome: formData.expectedOutcome,
            priorityLevel: formData.priorityLevel,
            overview: formData.description,
            skillsToLearn: formData.skillsToLearn,
            methodology: formData.methodology,
            timeline: formData.timeline,
            readingMaterials: formData.readingMaterials,
            templateForms: formData.templateForms,
            authorshipCriteria: formData.authorshipCriteria,
            teamMembers: formData.teamMembers,
            tasks: tasks
        };

        try {
            if (editingProject) {
                // Update existing project
                setProjects(prev => prev.map(p => p.id === editingProject.id ? projectData : p));
            } else {
                // Add new project
                setProjects(prev => [...prev, projectData]);
            }
            
            setShowCreateDialog(false);
            resetForm();
            setEditingProject(null);
            alert('Project saved successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project. Please try again.');
        }
    };

    const handleDeleteProject = (projectId: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            setProjects(prev => prev.filter(p => p.id !== projectId));
        }
    };

    // Task management functions
    const handleAddTask = () => {
        setEditingTask(null);
        resetTaskForm();
        setShowTaskDialog(true);
    };

    const handleEditTask = (task: ProjectTask) => {
        setEditingTask(task);
        setTaskFormData({
            title: task.title,
            description: task.description,
            slotsTotal: task.slotsTotal,
            timeCommitment: task.timeCommitment,
            level: task.level,
            teachingVideoUrl: task.teachingVideoUrl || "",
            supervisorName: task.supervisorName || "",
            deliverable: task.deliverable,
            deadline: task.deadline,
            requirements: task.requirements
        });
        setShowTaskDialog(true);
    };

    const handleSubmitTask = (e: React.FormEvent) => {
        e.preventDefault();

        const taskData: ProjectTask = {
            id: editingTask?.id || `task-${Date.now()}`,
            title: taskFormData.title,
            description: taskFormData.description,
            slotsTotal: taskFormData.slotsTotal,
            slotsOpen: editingTask?.slotsOpen || taskFormData.slotsTotal,
            timeCommitment: taskFormData.timeCommitment,
            level: taskFormData.level,
            teachingVideoUrl: taskFormData.teachingVideoUrl,
            supervisorName: taskFormData.supervisorName,
            deliverable: taskFormData.deliverable,
            deadline: taskFormData.deadline,
            requirements: taskFormData.requirements
        };

        if (editingTask) {
            setTasks(prev => prev.map(t => t.id === editingTask.id ? taskData : t));
        } else {
            setTasks(prev => [...prev, taskData]);
        }

        setShowTaskDialog(false);
        resetTaskForm();
        setEditingTask(null);
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    // Helper functions for array fields
    const addArrayItem = (field: keyof typeof formData, value: string) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...(prev[field] as string[]), value.trim()]
            }));
        }
    };

    const removeArrayItem = (field: keyof typeof formData, index:              t>
    </Selec                                           nt>
    /SelectConte       <                                             Item>
ctt</Sele Impact">Low-impac"lowtem value=    <SelectI                                               m>
     /SelectIte Impact<umdiMeact">m-imp"mediuue=valectItem      <Sel                                                  m>
 t</SelectIteac">High Imp"high-impactem value=electIt<S                                                   ent>
     electCont  <S                                            r>
      rigge   </SelectT                                              />
   priority" elect eholder="Sue placVal   <Select                                                    igger>
 ctTr       <Sele                                            }>
 e })l: valuLeve prioritymData, ...forta({etFormDa=> slue: any) {(vahange=nValueCyLevel} oata.prioritrmDlue={fo vaelect  <S                                             bel>
 /Laevel *< L">PriorityyLevelriorit htmlFor="p   <Label                                             ce-y-2">
"spaclassName=  <div                                        
   >
   </div                                       t>
    </Selec                                       
       ontent>  </SelectC                                            em>
      lectItmpleted</Sed">Completealue="cotem v  <SelectI                                                     Item>
 Selectcruiting</ng">Re"recruiti value=Item <Select                                                       ectItem>
e</Seltive">Activm value="acctIte     <Sele                                             m>
      s</SelectIteg Menteetinees">Accepg-mentacceptinlue="vaSelectItem          <                                              
 lectContent>         <Se                                           tTrigger>
elec         </S                                           />
 status"elect eholder="Slue placlectVa     <Se                                             
      lectTrigger>       <Se                                          )}>
   e }s: valuData, statuorm..f({ .etFormData> sny) ={(value: aChange=s} onValuetumData.stalue={for  <Select va                                              /Label>
us *<tat">Sor="statuslF<Label htm                                                -2">
e="space-yv classNam <di                                     ">
      p-4-3 gad-cols-1 md:gririd-colsame="grid glassN   <div c                              ">
       y-4e="space-ssNamla cdetails" value="ontent   <TabsC                           t>

      absConten    </T                          
      </div>                                         />
                                           red
    requi                                            ae"
hirurgi× Magister CREACH ="e.g., GI ceholder     pla                                        }
   }).value  e.targeton:ollaboratita, crmDa({ ...foata> setFormDnge={(e) =Cha       on                                        tion}
 llaboraformData.co={lue va                                           on"
    llaborati"co        id=                                       nput
   <I                                         
 Label>ion *</ollaborat">Cionborat="collalForhtm  <Label                                         
  >ce-y-2""spaassName=   <div cl                              >

       </div                                     >
          </div                              >
               /                                ed
          requir                                                  r Farooq"
ma., Dr. Ur="e.gaceholde      pl                                              )}
 }arget.valuead: e.tectLemData, proja({ ...forrmDat> setFoe={(e) =   onChang                                                 tLead}
mData.projecvalue={for                                                    jectLead"
   id="pro                                               ut
  np<I                                          
      d *</Label>Project LeaojectLead">="prForl htmlbe       <La                                         y-2">
ame="space-sNclas      <div                                       

     </div>                                     />
                                          
          required                                            "
       Langone)(NYUukat Aasma Sha Dr. g.,lder="e.aceho          pl                                   )}
       et.value }: e.targeadMentor, lformData{ ...a(tFormDate={(e) => seonChang                                                    ntor}
Data.leadMeformue={al        v                                         tor"
   ="leadMen    id                                             
    <Input                                              
 abel>or *</LLead Ment">torr="leadMenmlFo   <Label ht                                          -y-2">
   ="spacemediv classNa        <                                  p-4">
  s-2 gamd:grid-colcols-1 grid grid-Name="ass    <div cl                                    

  </div>                                
           </div>                                     ect>
      </Sel                                           tContent>
 elec/S   <                                                 ectItem>
el">Survey</Seylue="survectItem va     <Sel                                             em>
      h</SelectItnal Researcarch">Origil-reseue="originactItem valele    <S                                                   Item>
 ectview</Selc Re">Systematireviewystematic-alue="sctItem v       <Sele                                        
         ectItem>nalysis</Seleta-a">Mnalysis="meta-aueectItem val <Sel                                               
        ntent> <SelectCo                                             
      rigger>lectTSe  </                                        
          e" />ect typ projder="SelectlacehollectValue p    <Se                                                gger>
    ctTriele         <S                                         })}>
  lue ype: vatTjecData, pro{ ...formFormData(et=> svalue: any) eChange={(alu onVpe}rojectTyData.pformlue={lect va    <Se                                        el>
    e *</Labject Typ">ProjectTypeFor="proabel html     <L                                      >
     space-y-2""v className=       <di                              
       
    </div>                                    lect>
    Se    </                                         t>
   Conten   </Select                                                tem>
 ase</SelectIous Disee">Infectitious Diseasue="InfecctItem val   <Sele                                                >
     </SelectItemnal Medicine">Intericineal Medntern"Iue=val<SelectItem                                                         
tem></SelectI">Neurologygye="NeuroloctItem valu       <Sele                                       
          Item>/Selectrology<ephrology">Nephue="Nalm vSelectIte           <                                             Item>
Selectulmonology</gy">Pulmonoloe="Plutem va  <SelectI                                                    ectItem>
  /Selnology<>Endocriinology"e="EndocrItem valuelect       <S                                                ctItem>
 Selegy</">Oncolologyue="Oncom valSelectIte     <                                                   ectItem>
Selardiology</">CCardiology="lueectItem va       <Sel                                             m>
    ctIte/Seleogy<astroenterolology">Goenteralue="GastrItem v <Select                                                       
Content>    <Select                                         >
       lectTrigger     </Se                                               />
 specialty"t er="Selece placehold<SelectValu                                                        gger>
SelectTri          <                                       )}>
   lty: value }ta, specia.formDaData({ ..setForm{(value) => e=nValueChangty} oa.special{formDate=lect valuSe        <                                 >
       /Labellty *<>Speciaspecialty"or="<Label htmlF                                             -2">
   ce-yssName="spa cla      <div                                  >
    gap-4"cols-2 md:grid--cols-1 ="grid gridssName   <div cla                                 
    /div>
       <                            
              />                                 
  eduir         req                                    
      rows={4}                                       "
      ethodologyaims and mroject  research pon of the descriptiivens"Compreheholder=      place                                  )}
        alue }arget.vption: e.tData, descri.formormData({ ..(e) => setFge={    onChan                                      
      scription}mData.de value={for                                        n"
       escriptio     id="d                                     a
          <Textare                                      abel>
  *</Lerview oject Ovn">Pr"descriptioel htmlFor=ab       <L                                     2">
ce-y-="spasName   <div clas                              

        </div>                                      >
     /                                    uired
           req                                        2"
 OSE-ty vs Proplasastic Sleeve G of Endoscop., Efficacylder="e.g    placeho                                      })}
      t.value getle: e.tara, tirmData({ ...fo> setFormDathange={(e) =      onC                                  
        title}{formData.     value=                                          "
  id="title                                              ut
   <Inp                                          l>
*</Labeect Title itle">Proj htmlFor="tbel    <La                                       ">
 e-y-2ame="spacclassN    <div                                     -4">
e="space-y classNam="basic" valuebsContent  <Ta                               
   oject}>bmitPrandleSuSubmit={h   <form on                    
         o mt-4">y-aut overflow--[60vh]ame="max-hclassN<div                           ist>

       </TabsL                 er>
      TriggTabsasks</tasks">Talue="rigger vabsT<T                       
         sTrigger>s</Tabource">Res"resourceser value=rigg  <TabsT                              er>
s</TabsTriggail">Detilsdetaalue="bsTrigger v      <Ta                      igger>
    Info</TabsTr">Basic ue="basicr valabsTrigge       <T                 >
        s-4"id-col w-full gr="gridassNameclabsList          <T              >
     "w-full"className=e="basic" efaultValu  <Tabs d                   
   
eader>ogH      </Dial                 
 ion>escript   </DialogD                        sks
 and tarmation ailed infowith det project earchnsive res comprehe    Create a                           
 ption>alogDescri<Di                     
       ialogTitle></D                          "}
  roject Pncedeate Enha : "Crect"rojced Pan Enh ? "EdititingProject     {ed                    
       tle>  <DialogTi                          eader>
    <DialogH                  
  w-hidden">0vh] overflo-h-[9ax4xl m-w-"maxe=assNamnt clalogConte     <Di               ialog}>
howCreateD{setSenChange=ialog} onOpowCreateDn={shialog ope     <D    
       og */}ject Dialte/Edit Pro   {/* Crea            }

      )       </div>
                       
 ton>/But        <                 Project
nhanced EirstYour Feate        Cr              >
       " / mr-2"h-4 w-4sName=us clas     <Pl                      700">
 -blue- hover:bgblue-600"bg-me= classNaject}eProatre={handleCClickButton on          <            p>
  found</jects anced prob-4">No enhy-500 mgraame="text-sN     <p clas                  
 y-12">ext-center p="tsNamev clasdi           <   & (
      == 0 &ngth ={projects.le      
          /div>
       <}
                  ))           </Card>
                        dContent>
      </Car                 iv>
           </d                  
        /Button> <                          >
         4" /e="h-4 w-sNamclas <Trash2                                      >
                            
          d-50"bg-rever:0 hotext-red-70-600 hover:t-redssName="tex    cla                              "
         size="sm                           
          tline""ou  variant=                                      
roject.id)}eteProject(peDelhandllick={() => nC        o                             ton
   But       <                       
      on>      </Butt                           
        Edit                          
         4 mr-1" /> w-ame="h-4assN   <Edit cl                                       >
                         
         "x-1ssName="flela  c                                   "
   sme=" siz                                    e"
   "outliniant=  var                                   )}
   ject(projectandleEditPro hlick={() =>  onC                                  Button
        <                            -2">
    x gapssName="fle    <div cla                          
   </div>
                          
     div></                                    
}</span>sks.lengthta> {project.strong>Tasks:</><strong<span                                      " />
  w-4 mr-2="h-4 Namelock class  <C                                      ">
ay-600 text-gr-smter text items-cen="flexiv className     <d                               </div>
                               n>
     /spag()}<aleDateStrine).toLocdeadlinect.te(proj{new Dag> ine:</stronong>Deadl<str<span>                                  />
      r-2" 4 mh-4 w-e="lassNam <Calendar c                                 ">
      ray-600t-sm text-gex terntems-ceex itName="fliv class        <d                         /div>
    <                             
      pen</span>alRoles} oot}/{project.t.openRolesg> {projectones:</strong>Roltr    <span><s                              " />
      -4 w-4 mr-2ame="hassNsers cl          <U                        ">
      xt-gray-600-sm te text-center itemse="flexsNamlas      <div c                            b-4">
  pace-y-2 msName="s<div clas                           /p>

       <                          iew}
    ject.overv    {pro                               mp-2">
  line-clasmmb-4 text--gray-700 ame="textlassN      <p c                       nt>
   onte     <CardC                     
  ader>rdHe      </Ca                 n>
     dDescriptioar</C                        v>
              </di                             iv>
 /dlaboration}<.colctojeng> {pron:</stroCollaborati><strong>      <div                              iv>
    Mentor}</d.leadg> {projectntor:</stronLead Mestrong>   <div><                                  /div>
   ecialty}<spt.jec{prong> y:</stroecialt<strong>Spiv>    <d                            
        m">1 text-sce-y-spa"me=Nalassdiv c         <                        ion>
   cript<CardDes                           
     le>CardTitct.title}</">{projext-lge="teNamle class<CardTit                            
    /div> <                      >
         </div                                adge>
            </B                               ' ')}
 , ace('-'tyLevel.replpriorict.   {proje                                 }>
        evel)tyLri.prioolor(projectorityCPrissName={getge cla  <Bad                                    Badge>
           </                             ' ')}
   eplace('-',ect.status.r   {proj                                       s)}>
  ct.statulor(projeusCoetStat{ge= classNamadge <B                                
       ge> </Bad                                   
    ')}-', ' pe.replace('ct.projectTy{proje                                    >
        00"ue-8xt-blte0 -10bg-bluessName="la <Badge c                                   >
    " gap-2x-wrapflex fleme="sNaiv clas <d                                  b-2">
 -start mems itify-betweenflex justme="iv classNa<d                        r>
        dHeade       <Car                     
dow">sition-shatranr:shadow-lg me="hoveid} classNat.ec key={proj<Card                 (
       > ) =ctap((projects.mproje   {                 p-6">
2 ga:grid-cols-s-1 lgcol grid-e="gridssNam<div cla               
 s Grid */}ect {/* Proj            v>

    </di                 </Card>
              ntent>
       </CardCo                 >
           </div                >
       </div                         >
     </p                                 h, 0)}
   ngtleks.m + p.tasm, p) => su((sureduceojects. {pr                                     ">
  gray-900xt--bold te fontext-2xlme="tlassNa c   <p                                 Tasks</p>
600">Total gray-t-exm tm font-mediutext-sclassName="    <p                                ">
 me="ml-4<div classNa                                iv>
/d     <                     />
      00" ple-6text-pur"h-6 w-6 ssName=laers c  <Us                                -lg">
   roundedg-purple-100="p-2 bv className<di                                -center">
lex items"fclassName=  <div                        -6">
   assName="pContent cl     <Card                  <Card>
                   
  </Card>
              nt>
      nteCord  </Ca            
          div> </                          >
 iv     </d                        
          </p>                      h}
       ').lengtctiveatus === 'a=> p.stter(p rojects.fil   {p                            
         >gray-900"d text-2xl font-bole="text-<p classNam                                  >
  ts</pojecActive Pray-600">grt-t-medium texext-sm fon="tclassName   <p                              
    ">="ml-4sName  <div clas                           
   v> </di                        />
       00" ow-6ext-yellh-6 w-6 tame="ock classN  <Cl                                  
">ded-lglow-100 rounyel2 bg-="p-ssName <div cla                               enter">
x items-ce="fle classNam       <div                  
   6">="p-classNament ardConte     <C                       <Card>
            d>

     </Car               t>
    Conten      </Card                   </div>
                       >
    iv        </d                  p>
             </                             ).length}
ng-mentees'ccepti== 'aus => p.stat =s.filter(pct    {proje                                   ay-900">
 d text-gr font-bol-2xlName="text class<p                                 >
   es</pMenteepting y-600">Accium text-gra font-medme="text-smassNa   <p cl                           ">
      Name="ml-4iv class<d                           
          </div>                         
  en-600" /> text-gre"h-6 w-6sName=r clas<Calenda                          
          ">ed-lgndouen-100 r"p-2 bg-greassName=cldiv            <                   >
  ems-center"="flex itmessNa<div cla                            
me="p-6">ssNadContent cla   <Car                    rd>
       <Ca          

    rd>      </Ca              dContent>
</Car                           </div>
                >
         iv         </d                      /p>
 gth}<.lenojects00">{pr-gray-9ld textont-boxl fext-2"te=sNamp clas         <                          
 ects</p>ojal Pr>Totgray-600"ext-ium tsm font-medext-Name="tlass     <p c                             >
  me="ml-4"v classNa       <di                         iv>
/d         <               
        " />-blue-600 text6 w-6Name="h-s classUser      <                          
    ">ounded-lg0 r2 bg-blue-10="p-assName cl <div                            
   enter">ms-cflex iteclassName="    <div                  
       ="p-6">t classNamenten  <CardCo               >
           <Card            ">
    b-8s-4 gap-6 mmd:grid-colrid-cols-1 grid gsName="   <div clas         s */}
    tats Card   {/* S     
         </div>
             
  utton>       </B           
   ProjectedncCreate Enha                  
      4 mr-2" />-4 w-"hlassName=us c       <Pl              
   ue-700">er:bg-blovlue-600 hsName="bg-bect} clasProjCreatelick={handleonC<Button              >
       /div  <              ks</p>
    as with th projectsive researcrehenscompmanage eate and y-600">Crt-graexe="tssNamla    <p c                  
  ent</h1>ect Managemroj Pnced>Enha"-gray-900old text2xl font-b="text-Name class    <h1                  v>
          <di         mb-6">
   ems-center y-between it justifsName="flexlas c       <div     
    der */}ea/* H       {
         >me="p-6"sNa <div clas        cts">
   projege="currentPaLayout       <Adminturn (
     re   };

        }
 
 ay-800';ext-gr00 tg-gray-1 return 'b         lt:
         defau        ';
 800ue-ble-100 text-n 'bg-blu      retur       ct':
   impa 'low-     case       ';
nge-800xt-orarange-100 te-o'bgn uret     r         
  ium-impact':se 'med         ca
   ;ed-800'0 text-r 'bg-red-10    return        
    mpact':igh-i'h  case     
      ity) {witch (prior  s     ng) => {
 tripriority: s (ityColor =iorst getPr

    con  }
    };
      00';ay-800 text-grn 'bg-gray-1   retur             efault:
        d;
    t-gray-800'0 texy-10 'bg-gra      return      ':
    e 'completedcas           low-800';
 elt-y00 tex-1-yellow 'bg      return          g':
ruitinse 'rec    ca       00';
  text-blue-8100'bg-blue-n       retur          active':
  case '          0';
en-80ext-greeen-100 turn 'bg-gr ret             
  :mentees'ting-ccepe 'a  cas
          s) {tatuch (s    swit) => {
    us: string= (statColor tatustS const ge
   };
);
      })    dex)
  i !== in i) => ilter((_,irements.fs: prev.requrementrequi            rev,
     ...p     > ({
  rev =rmData(pskFo    setTa=> {
    er) mb: nu = (indexquirement removeRe const  };

    }
  ;
           }))
        rim()]e.tlunts, vaequireme...prev.ruirements: [      req          ev,
  ...pr            > ({
  prev =ata(mDetTaskFor     s      {
 m()) value.tri (        ifng) => {
value: stri (equirement = const addR  };

   
  ;   }))     
!== index)i =>  i) ((_,g[]).filterintrld] as s (prev[fie   [field]:
            ...prev,        {
 v => (mData(presetFor        r) => {
numbe