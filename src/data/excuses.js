
export const excuses = {
  'bug still exists': {
    professional: [
      "The issue has been identified and a fix is in progress. It involves an edge case with state management that only manifests under specific race conditions.",
      "This is a known regression introduced in the last sprint. We're prioritizing it for the next patch release.",
      "Root cause analysis is complete — it's a timing issue in the async pipeline. We're implementing a mutex pattern.",
    ],
    chaotic: [
      "It works on my machine and my machine is the source of truth.",
      "The bug is not a bug. It's an undocumented feature that our most important client relies on.",
      "I fixed it but then I fixed it again and now I'm not sure which fix broke the original fix.",
    ],
    desperate: [
      "I've been staring at this for 6 hours. I think the code is gaslighting me.",
      "Every time I fix it, a different line breaks. I think the codebase is sentient and angry.",
      "I need 10 more minutes. I've been saying that for 3 days.",
    ],
    corporate: [
      "We're leveraging a phased remediation approach to ensure minimal disruption to the end-user experience.",
      "This defect has been escalated to P1 and is in active resolution status across the engineering vertical.",
      "We're aligning cross-functional stakeholders to drive a sustainable, scalable fix to this critical path issue.",
    ],
  },
  'missed deadline': {
    professional: [
      "The scope expanded mid-sprint after the design review, which pushed the timeline by two days.",
      "We hit an unexpected dependency on a third-party API that wasn't documented in the spec.",
      "Technical debt in the legacy module took significantly longer to resolve than estimated.",
    ],
    chaotic: [
      "Time is a flat circle and the deadline was an illusion.",
      "I thought the deadline was in a different timezone. I was wrong about every timezone.",
      "I finished it on time in an alternate timeline. You're in the wrong one.",
    ],
    desperate: [
      "I underestimated by a factor of three. I always underestimate by a factor of three.",
      "I was 90% done for five days straight. I don't understand how that's possible.",
      "Stack Overflow was down for 20 minutes and that was the 20 minutes I needed.",
    ],
    corporate: [
      "Delivery has been re-baselined to align with updated business priorities and resource availability.",
      "We proactively identified a risk to the delivery timeline and are actioning a mitigation plan.",
      "The timeline shift reflects our commitment to quality over velocity in this strategic initiative.",
    ],
  },
  'prod went down': {
    professional: [
      "A config value in the environment variables was overridden during the last deployment. It's been reverted.",
      "The load balancer health checks were misconfigured — traffic was routed to a terminated instance.",
      "A database index was accidentally dropped during a migration. We've restored from the latest snapshot.",
    ],
    chaotic: [
      "I deployed on a Friday. I know. I know.",
      "Everything was fine until it wasn't. The logs say 'undefined' which is technically informative.",
      "The production server saw what we did in staging and decided it wanted no part of it.",
    ],
    desperate: [
      "It was working 10 minutes ago. I didn't change anything. I may have changed something.",
      "I did a 'quick config change' and I deeply regret that phrase.",
      "git blame is pointing at me and git blame is correct.",
    ],
    corporate: [
      "We experienced an unplanned service disruption. Our incident response protocol was immediately activated.",
      "The production environment encountered a degraded state, which has since been fully remediated.",
      "This event has been captured in our post-mortem process to prevent future recurrence.",
    ],
  },
  'deploy failed': {
    professional: [
      "The CI pipeline failed on a flaky integration test — we're re-running after a brief hold.",
      "A required environment secret wasn't rotated in the deployment target. It's being updated now.",
      "The container image build exceeded the memory threshold. We're optimizing the Dockerfile.",
    ],
    chaotic: [
      "The pipeline said 'success' right before everything failed. I'm choosing to believe the pipeline.",
      "It passed locally. It passed in CI. It did not pass in prod. I have no explanation.",
      "The error message is 'unexpected error'. That's all I have.",
    ],
    desperate: [
      "I've rolled it back. I've re-deployed it. I've rolled it back again. We're in a loop.",
      "The deploy script works exactly 50% of the time and I cannot figure out which variable determines that.",
      "I've escalated this to 'will figure out tomorrow'. Today is tomorrow.",
    ],
    corporate: [
      "The deployment encountered an environmental constraint and is currently queued for re-execution.",
      "We're conducting a deployment readiness review to ensure all pre-production gates are satisfied.",
      "The release has been temporarily paused to ensure alignment with our change management process.",
    ],
  },
  'missed standup': {
    professional: [
      "I had a conflicting incident response call that took priority — I've already caught up on the notes.",
      "The calendar invite was in a timezone that doesn't observe DST. I've corrected my calendar settings.",
      "I was on a client call that ran over — I've synced with the team asynchronously.",
    ],
    chaotic: [
      "My laptop was doing that thing where it updates for 40 minutes despite saying '1 minute remaining'.",
      "I thought standup was at 10. It is at 9:30. It has always been at 9:30.",
      "I was there in spirit. My Slack status was set to 'in a meeting' which is close enough.",
    ],
    desperate: [
      "I snoozed the calendar notification. Then I snoozed it again. There were 4 snoozes total.",
      "I have been in this timezone for 6 months and I still convert the time wrong every single day.",
      "I was writing the update I was going to share in standup and lost track of time writing it.",
    ],
    corporate: [
      "I was engaged in a high-priority deliverable and was unable to context-switch to the synchronous touchpoint.",
      "My attendance was impacted by a competing strategic obligation — I've reviewed the meeting notes.",
      "I proactively reviewed the standup summary and am fully aligned with the team's action items.",
    ],
  },
  'pr not reviewed': {
    professional: [
      "The PR is complex and requires input from two teams — we're scheduling a sync to align before merging.",
      "It's blocked on a dependency that's currently in review upstream.",
      "The reviewers flagged an architectural concern that we're evaluating before moving forward.",
    ],
    chaotic: [
      "I left 47 comments and then forgot to submit the review. They're all still saved as drafts.",
      "I reviewed it in my head. The review was mostly positive.",
      "My PR has 12 unresolved threads, 3 of which are arguments about semicolons.",
    ],
    desperate: [
      "It's been open for 9 days and I've made 27 commits trying to satisfy the review comments.",
      "I think my reviewers are testing how long I'll keep rebasing before I give up.",
      "The PR is ready. The PR has been ready. Please.",
    ],
    corporate: [
      "The change request is progressing through our multi-stakeholder review and approval workflow.",
      "We're ensuring thorough due diligence on this PR to maintain our engineering quality standards.",
      "The review cycle is ongoing — we're aligning on technical direction before proceeding to merge.",
    ],
  },
}
