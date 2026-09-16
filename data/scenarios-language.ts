import type { Scenario } from "@/types";

/**
 * Language track: 34 scenarios of ambiguous everyday communication.
 *
 * PROVENANCE. Every scenario here was written for this experiment. None is taken
 * from a real message, chat log, DM or email, and no participant's own material is
 * used. This is a deliberate methodological constraint: using real private messages
 * would make the data richer and the project unusable, and it would also make
 * consent impossible to obtain from the person who wrote the message rather than the
 * person who received it.
 *
 * DESIGN. Each scenario supplies a context, one ambiguous act, and three to five
 * interpretations chosen so that at least two remain defensible after all evidence
 * is seen. Evidence items are written to discriminate — to raise some hypotheses
 * and lower others — except where a scenario is explicitly built to underdetermine,
 * which the design note says outright.
 *
 * The design notes are shown to participants only after they have finished updating,
 * so that the intent behind an item cannot steer the update it is meant to measure.
 */

const S = (
  id: string,
  title: string,
  context: string,
  stimulus: string,
  question: string,
  interps: [string, string, string][],
  evidence: [string, string, string][],
): Scenario => ({
  id,
  track: "language",
  title,
  context,
  stimulus,
  question,
  source: "original",
  interpretations: interps.map(([iid, label, gloss]) => ({ id: iid, label, gloss })),
  evidence: evidence.map(([eid, text, designNote]) => ({ id: eid, text, designNote })),
});

export const languageScenarios: Scenario[] = [
  S(
    "sure",
    "Sure.",
    "Two friends have been trying to arrange an evening for a while. One of them sends a message in the afternoon: “Are you coming tonight?”",
    "The reply, forty minutes later, is a single word: “Sure.”",
    "What does the reply mean?",
    [
      ["keen", "Enthusiastic agreement", "They want to come and are being brief, not cool."],
      ["reluctant", "Reluctant agreement", "They will come, but the word is carrying some resistance."],
      ["neutral", "Neutral agreement", "A plain yes with no colour on it at all."],
      ["sarcasm", "Not really agreement", "Something closer to “I suppose I have no choice”."],
    ],
    [
      ["e1", "This person normally replies within a minute or two and usually writes several lines.", "Raises reluctance and sarcasm by making both the delay and the brevity departures from a baseline. Note how much work a baseline does: without it, forty minutes means nothing."],
      ["e2", "Earlier in the week they had said they were exhausted and might need a quiet weekend.", "Raises reluctance; pushes against sarcasm, since tiredness explains the flatness without any edge in it."],
      ["e3", "They arrive first, and stay late.", "Outcome evidence, arriving after the interpretation was formed. Whether participants use it to revise a reading of the message — or treat behaviour and message as separate — is one of the things this scenario is watching for."],
    ],
  ),
  S(
    "fine-work",
    "“This is fine.”",
    "A junior colleague sends a first draft of a document to a senior colleague for comment.",
    "The reply, in full: “This is fine.”",
    "How should the junior colleague read it?",
    [
      ["approval", "Genuine approval", "It meets the bar. There is nothing further to say."],
      ["disappointed", "Muted disappointment", "It clears a low bar and the brevity is the message."],
      ["busy", "Bandwidth, not judgement", "The reply is short because the day is full; it carries no evaluation at all."],
      ["defer", "Deferral", "They have not really read it and are unblocking the work for now."],
    ],
    [
      ["e1", "The senior colleague's replies to other people that week are of a similar length.", "Strong support for the bandwidth reading and a useful lesson: a base rate can dissolve an apparent signal."],
      ["e2", "Two days later they forward the document to their own manager without changes.", "Raises approval and lowers deferral, though forwarding unread is possible."],
    ],
  ),
  S(
    "left-on-read",
    "The unanswered message",
    "A person sends a long message to a close friend explaining something difficult that happened at home.",
    "The friend reads it — the app shows this — and does not reply for two days.",
    "What is the silence?",
    [
      ["overwhelmed", "Not knowing what to say", "The message is large and the friend is waiting until they can answer it properly."],
      ["withdrawal", "Withdrawal", "The friend is pulling back from the relationship."],
      ["circumstance", "Circumstance", "Something unrelated is occupying them entirely."],
      ["avoid", "Discomfort with the topic", "The particular subject is one the friend avoids."],
    ],
    [
      ["e1", "During those two days the friend posts publicly about something light and unrelated.", "Usually read as strong evidence for withdrawal or avoidance. Worth noticing that posting takes a fraction of the effort of answering a hard message, so the inference is weaker than it feels."],
      ["e2", "When they do reply it is four paragraphs long and opens by apologising for taking time to find the words.", "Direct support for 'not knowing what to say'. Whether participants trust a stated reason is itself a measurable thing."],
    ],
  ),
  S(
    "no-worries",
    "“No worries!”",
    "Someone cancels plans a few hours before, for the second time in a fortnight.",
    "The other person replies: “No worries!”",
    "What is behind the reply?",
    [
      ["genuine", "Actually fine", "The cancellation cost them nothing."],
      ["managing", "Smoothing it over", "It did cost something; the reply is maintenance work on the friendship."],
      ["tally", "Keeping score", "Nothing is said now and something is being recorded."],
      ["relief", "Relief", "They wanted the evening back too."],
    ],
    [
      ["e1", "They had rearranged a work commitment to make the evening possible.", "Lowers 'actually fine' and relief substantially; raises smoothing and score-keeping."],
      ["e2", "They immediately propose two alternative dates.", "Raises smoothing and lowers score-keeping, on the reasoning that withdrawal is the usual behavioural signature of a tally."],
    ],
  ),
  S(
    "as-discussed",
    "“As discussed.”",
    "After a meeting where a decision was contested, one attendee sends a summary email to the group.",
    "The summary opens: “As discussed, we're proceeding with option B.”",
    "What is the phrase doing?",
    [
      ["record", "Record-keeping", "A neutral minute of what happened."],
      ["closing", "Closing the question", "The wording is designed to make reopening the debate look like backtracking."],
      ["cover", "Covering themselves", "Creating a written trail in case option B goes badly."],
      ["assume", "An honest misreading", "They genuinely believe the meeting concluded that way."],
    ],
    [
      ["e1", "The meeting ended with two people still objecting and no vote taken.", "Lowers 'record'; raises closing and honest misreading, and leaves 'cover' roughly untouched."],
      ["e2", "The email is copied to a senior manager who was not in the meeting.", "Raises closing and cover. A case where the routing of a message is stronger evidence than its wording."],
    ],
  ),
  S(
    "interesting",
    "“Interesting.”",
    "A student presents an idea to a teacher they do not know well.",
    "The teacher pauses and says: “Interesting.”",
    "What has been communicated?",
    [
      ["engaged", "Genuine interest", "The idea landed and they are thinking."],
      ["polite", "Politeness", "A placeholder that avoids saying anything evaluative."],
      ["doubt", "Reservation", "The word is standing in for a criticism not yet formed."],
      ["surprise", "Surprise", "Not judgement — recalibration. The idea was not what they expected from this student."],
    ],
    [
      ["e1", "They then ask three specific follow-up questions about how it would be tested.", "Strong support for genuine interest; strong against politeness. Costly signals — effort spent — discriminate better than word choice."],
      ["e2", "They say the same word to the next three presenters.", "Restores politeness sharply. The base rate again."],
    ],
  ),
  S(
    "thanks-period",
    "“Thanks.”",
    "A colleague sends a document that took several hours to prepare, after being asked for it urgently.",
    "The reply arrives: “Thanks.”",
    "How should it be read?",
    [
      ["normal", "Ordinary acknowledgement", "The word means what it says."],
      ["curt", "Displeasure", "Something about the document or the delay is not being said."],
      ["distracted", "Distraction", "They are mid-task and acknowledging receipt."],
      ["formal", "Register, not feeling", "This person simply writes tersely to everyone."],
    ],
    [
      ["e1", "Their previous messages in the thread were long and used exclamation marks.", "A within-person baseline: raises displeasure and lowers 'register'."],
      ["e2", "A minute earlier they replied to an unrelated thread with a single word too.", "A within-hour baseline pointing the other way — raises distraction. Two baselines can conflict, and which one participants weight is informative."],
    ],
  ),
  S(
    "we-should-catch-up",
    "“We should catch up sometime.”",
    "Two former classmates meet by chance and talk for a few minutes.",
    "One of them says: “We should catch up sometime.”",
    "Is this an intention?",
    [
      ["real", "A real intention", "They mean to arrange it."],
      ["ritual", "A closing ritual", "The phrase ends conversations; it is not a plan."],
      ["conditional", "A conditional opening", "They mean it if the other person takes the next step."],
      ["guilt", "An apology in disguise", "An acknowledgement that contact lapsed, aimed at the past rather than the future."],
    ],
    [
      ["e1", "They send a message that evening with two possible dates.", "Decisive for 'real intention'. Included as a calibration item: some evidence genuinely does resolve ambiguity, and an experiment that only ever underdetermines would be teaching the wrong lesson."],
      ["e2", "The same phrase was used at the last two chance meetings, with nothing following.", "Decisive the other way. Presented to a different participant group as a between-subjects contrast."],
    ],
  ),
  S(
    "just-checking",
    "“Just checking in on this.”",
    "A request has been outstanding for a week. The person waiting sends a follow-up.",
    "The whole message is: “Just checking in on this.”",
    "What is the tone?",
    [
      ["neutral", "Neutral", "A reminder with no charge."],
      ["pressure", "Applied pressure", "Polite words doing impolite work."],
      ["anxiety", "Anxiety", "The sender is worried about their own position, not annoyed at yours."],
      ["procedural", "Procedural", "A ticket is being kept alive; no person is being addressed."],
    ],
    [
      ["e1", "The message arrived at 06:40, and the sender is normally offline overnight.", "Genuinely ambiguous between anxiety and pressure, and consistent with a different time zone. A test of whether participants read a timestamp as personality."],
      ["e2", "The word “just” was added in an edit — the app shows the message was edited.", "Raises anxiety and softening effort; participants tend to read hedging as deliberate. Note that the direction of an edit is knowable here, which is unusual."],
    ],
  ),
  S(
    "ok-then",
    "“Ok then.”",
    "A plan has been changed by one person without consulting the other.",
    "The other replies: “Ok then.”",
    "What is it carrying?",
    [
      ["acceptance", "Acceptance", "The change is genuinely fine and the reply carries nothing else."],
      ["hurt", "Hurt", "Being left out of the decision is the issue, not the decision."],
      ["end", "Ending the exchange", "A signal that they do not want to discuss it further now."],
      ["irritation", "Irritation", "Aimed at the change itself."],
    ],
    [
      ["e1", "“Then” was not present in any of this person's previous agreements in the thread.", "A micro-baseline. Raises hurt and irritation; a single particle carrying most of the evidential weight is worth pointing at."],
      ["e2", "They reply normally about a different topic ten minutes later.", "Pulls toward acceptance or 'ending the exchange', away from durable hurt."],
    ],
  ),
  S(
    "apology-conditional",
    "“I'm sorry if that upset you.”",
    "After a disagreement, one person offers an apology.",
    "The words are: “I'm sorry if that upset you.”",
    "What is being apologised for?",
    [
      ["nothing", "Nothing", "The conditional cancels the apology; only the other person's reaction is conceded."],
      ["uncertain", "Genuine uncertainty", "They do not know whether it landed badly and are asking."],
      ["effect", "The effect only", "They stand by the act and regret the harm — a coherent position, not a dodge."],
      ["formula", "A formula", "This is simply how they have learned to apologise."],
    ],
    [
      ["e1", "In the same message they restate their original point in stronger terms.", "Lowers 'genuine uncertainty' sharply; raises 'nothing'."],
      ["e2", "They have used this exact construction in every apology the other person can remember.", "Raises 'a formula' — an individual linguistic habit, not a stance. A recurring theme: idiolect explains a lot of apparent intent."],
    ],
  ),
  S(
    "good-luck",
    "“Good luck with that.”",
    "Someone describes a difficult plan to a colleague.",
    "The colleague says: “Good luck with that.”",
    "Which reading fits?",
    [
      ["sincere", "Sincere", "They hope it works, and the phrase means exactly what it says."],
      ["dismissive", "Dismissive", "They think it will not work and are not going to argue."],
      ["warning", "A warning", "They know something about the difficulty and are signalling it."],
      ["humour", "Shared humour", "Both know it is hard; the line is a joke between equals."],
    ],
    [
      ["e1", "The colleague attempted something similar last year and it failed.", "Raises warning and dismissiveness, and makes them hard to separate — the same experience produces both."],
      ["e2", "They follow up the next day with a list of the specific obstacles they hit.", "Resolves toward warning. Behaviour over time discriminating between readings that a single utterance could not."],
    ],
  ),
  S(
    "per-my-last-email",
    "“Per my last email.”",
    "A question is asked that was already answered in a previous message in the same thread.",
    "The reply begins: “Per my last email…”",
    "What is happening?",
    [
      ["pointer", "A pointer", "Efficient reference to existing information."],
      ["rebuke", "A rebuke", "A polite formula used to mark that the reader did not read."],
      ["record", "For the record", "Aimed at others on the thread, not the asker."],
      ["habit", "Corporate habit", "A phrase used automatically, with no attitude attached."],
    ],
    [
      ["e1", "The previous email was sent eleven minutes earlier.", "Raises rebuke; a very recent message makes the reminder harder to read as helpful."],
      ["e2", "The reply also restates the answer in full underneath.", "Raises pointer and habit — doing the work anyway is not the behaviour of someone making a point."],
    ],
  ),
  S(
    "silence-meeting",
    "The quiet participant",
    "In a meeting of eight people, one person says nothing for the full hour despite the topic being their area.",
    "They do not speak, and do not visibly react.",
    "Why?",
    [
      ["disagree", "Silent disagreement", "They object and have decided not to spend capital on it."],
      ["unprepared", "Unprepared", "They have nothing ready and are avoiding exposure."],
      ["norm", "Reading the room", "Their sense of when to speak differs from the room's, for reasons of culture or seniority."],
      ["disengaged", "Disengagement", "They no longer care about the outcome."],
    ],
    [
      ["e1", "They send a detailed written objection to the chair that evening.", "Decisive against 'unprepared' and 'disengaged'; splits between disagreement and norm."],
      ["e2", "They are the most junior person present and the only one who joined in the last month.", "Raises the norm reading considerably. A reminder that structural facts often explain behaviour that reads as personality."],
    ],
  ),
  S(
    "emoji-drop",
    "The vanished exclamation marks",
    "Two people have messaged daily for months in a warm, punctuation-heavy style.",
    "Over about a week, one of them shifts to plain sentences with full stops.",
    "What changed?",
    [
      ["cooling", "Cooling", "The relationship is losing warmth."],
      ["life", "Something outside", "Their circumstances changed and the style followed."],
      ["mirroring", "Mirroring", "The other person's style shifted first and this is a response."],
      ["nothing", "Nothing", "Style drifts. There is no signal here."],
    ],
    [
      ["e1", "Message length and reply speed are unchanged over the same period.", "Argues against cooling: the costly parts of the behaviour are stable while only the cheap decoration changed."],
      ["e2", "Their messages to a shared group chat changed in the same way over the same week.", "A within-person control across audiences. Strongly favours 'something outside' over anything relationship-specific."],
    ],
  ),
  S(
    "ill-think-about-it",
    "“I'll think about it.”",
    "A proposal has been put to someone who has the authority to decline it outright.",
    "They say: “I'll think about it.”",
    "Is this a no?",
    [
      ["no", "A soft no", "The refusal is being delivered in a form that avoids a scene."],
      ["yes", "Genuine consideration", "They have not decided."],
      ["time", "Buying time", "The decision depends on something else they are waiting for."],
      ["negotiate", "An invitation", "They want the terms improved before they say yes."],
    ],
    [
      ["e1", "They ask no further questions before or after.", "Raises the soft-no reading; genuine consideration usually generates information-seeking."],
      ["e2", "They mention that a budget decision above them lands next month.", "Raises 'buying time' and largely dissolves the ambiguity — the kind of context that costs one sentence and changes everything."],
    ],
  ),
  S(
    "compliment-hedge",
    "“That's actually really good.”",
    "Someone shows a piece of work to a peer.",
    "The peer says: “That's actually really good.”",
    "What is “actually” doing?",
    [
      ["surprise", "Genuine surprise", "They expected less, and are saying so without meaning harm."],
      ["backhanded", "A backhanded compliment", "The surprise is the message."],
      ["emphasis", "Emphasis", "In this speaker's idiolect “actually” means “very”."],
      ["contrast", "Contrast with expectation of the genre", "The surprise is about the type of work, not this person."],
    ],
    [
      ["e1", "The speaker uses “actually” as an intensifier throughout the rest of the conversation, in contexts with no expectation to violate.", "Strong support for the idiolect reading. Designed to show how much apparent slight is grammar."],
      ["e2", "They had earlier declined to look at an earlier version, saying they were busy.", "Mildly raises 'backhanded' and 'genuine surprise' by supplying a prior about their estimate of the work."],
    ],
  ),
  S(
    "let-me-know",
    "“Let me know if you need anything.”",
    "A person is going through something difficult. An acquaintance sends a message.",
    "The message ends: “Let me know if you need anything.”",
    "What is the offer worth?",
    [
      ["real", "A real offer", "They will act if asked."],
      ["phatic", "A social form", "It performs care without creating an obligation."],
      ["distance", "Care at a distance", "They want to help and do not want to intrude, so they put the initiative on the other person."],
      ["exit", "A closing move", "It ends the exchange politely."],
    ],
    [
      ["e1", "They follow it a day later with a specific offer: a named task, on a named day.", "The strongest available discriminator — specificity costs something, generality does not."],
      ["e2", "They are the only one of the person's acquaintances who wrote at all.", "Raises 'real' and 'care at a distance' via a base-rate argument: writing when others did not is itself costly."],
    ],
  ),
  S(
    "same-page",
    "“Are we on the same page?”",
    "At the end of a difficult conversation between two people who disagreed, one of them asks a question.",
    "“Are we on the same page?”",
    "What is being asked?",
    [
      ["check", "A genuine check", "They want to know whether agreement was reached."],
      ["confirm", "A request for capitulation", "The question is shaped so that “no” is the difficult answer."],
      ["repair", "Relationship repair", "The content is settled; they are asking whether things are all right between them."],
      ["record", "Establishing a shared account", "They want a version both can refer to later."],
    ],
    [
      ["e1", "They ask it while already standing up to leave.", "Raises 'capitulation' and 'record'; genuine checks tend not to be asked on the way out."],
      ["e2", "The other person says “not quite”, and they sit back down.", "Decisive for the genuine check. Behaviour after a question often tells you what the question was."],
    ],
  ),
  S(
    "over-apology",
    "The fourth apology",
    "Someone made a small mistake at work two days ago. It was fixed within the hour and nobody mentioned it again.",
    "They apologise for it for the fourth time.",
    "What is going on?",
    [
      ["anxiety", "Anxiety", "The apologies are regulating their own discomfort."],
      ["reassurance", "Seeking reassurance", "Each apology is a request for a specific response."],
      ["norm", "Politeness norm", "In their setting, repeated apology is ordinary and carries no distress."],
      ["conflict", "Something else", "The apology is standing in for a different unresolved issue."],
    ],
    [
      ["e1", "Each apology comes shortly after an interaction with the same manager.", "Raises 'something else' and reassurance-seeking, and supplies a specific trigger."],
      ["e2", "They apologise at a similar rate to everyone else in their team.", "Restores the norm reading and shows how quickly a peer base rate can deflate an individual diagnosis."],
    ],
  ),
  S(
    "ghost-recruiter",
    "The unanswered application",
    "A candidate completes three rounds of interviews and is told a decision will come by Friday. Friday passes with no message.",
    "Two weeks of silence.",
    "What does the silence indicate?",
    [
      ["reject", "A rejection not yet sent", "The decision is no and nobody has written it."],
      ["internal", "Internal delay", "The process stalled for reasons unrelated to the candidate."],
      ["second", "Second choice", "An offer is out to someone else and they are waiting."],
      ["frozen", "The role changed", "Hiring was paused or the role was restructured."],
    ],
    [
      ["e1", "The job posting is taken down during the second week.", "Genuinely ambiguous: consistent with a filled role, a frozen role, and a withdrawn role. Included as an explicitly underdetermining item."],
      ["e2", "Two other candidates from the same process report the same silence.", "Strongly favours internal delay or a frozen role over anything candidate-specific — the closest this track gets to a controlled comparison."],
    ],
  ),
  S(
    "praise-public",
    "Public praise",
    "A manager praises one team member by name in a company-wide message, for work several people contributed to.",
    "The message names one person.",
    "How should the omission be read?",
    [
      ["oversight", "Oversight", "They wrote it quickly and named who came to mind."],
      ["visibility", "Visibility management", "They are deliberately raising one person's profile."],
      ["accurate", "Accurate", "That person did do the decisive part."],
      ["signal", "A signal to the others", "The omission is the point."],
    ],
    [
      ["e1", "The same manager sent a private thank-you to each of the others that morning.", "Strongly against 'a signal'; raises visibility management and oversight."],
      ["e2", "The named person is the one who had been passed over for promotion last cycle.", "Raises visibility management substantially. Also a good illustration of motive evidence versus act evidence."],
    ],
  ),
  S(
    "we-need-to-talk",
    "“We need to talk.”",
    "A message arrives from someone close, with no further detail, at 9pm.",
    "“We need to talk.”",
    "What is coming?",
    [
      ["bad", "Something bad about the relationship", "The canonical reading."],
      ["external", "Something bad elsewhere", "News they need to deliver about something outside the two of them."],
      ["logistics", "Logistics", "A practical matter that needs a conversation rather than a thread."],
      ["good", "Something significant and good", "Big news, delivered in the same compressed form."],
    ],
    [
      ["e1", "They add “nothing bad” four minutes later.", "Interesting rather than decisive: participants often discount the reassurance. Whether they do is measurable here."],
      ["e2", "This person has used the same phrase twice before, both times about scheduling.", "A within-person base rate that cuts hard against the canonical reading. One of the clearest prior-versus-evidence conflicts in the set."],
    ],
  ),
  S(
    "feedback-sandwich",
    "The middle of the sandwich",
    "A piece of feedback arrives structured as praise, then a criticism, then praise.",
    "The reader has to decide how much weight the middle carries.",
    "What is the real content?",
    [
      ["middle", "The criticism", "The praise is packaging."],
      ["whole", "All three", "The praise is sincere and so is the criticism."],
      ["soft", "The criticism, softened because it is serious", "The packaging scales with the severity."],
      ["ritual", "Nothing in particular", "The form is required by their process; no individual judgement is encoded."],
    ],
    [
      ["e1", "The praise is specific and references details only a careful reader would notice.", "Raises 'all three' and lowers 'packaging' — specificity as a proxy for effort, used repeatedly across this set."],
      ["e2", "Their feedback to everyone that cycle follows the identical three-part shape.", "Raises the ritual reading. The set deliberately repeats the structure-versus-signal contrast across several scenarios to see if participants generalise the lesson."],
    ],
  ),
  S(
    "loud-agreement",
    "Very fast agreement",
    "In a discussion, one person raises a concern. Another immediately and warmly agrees, then moves the conversation on.",
    "The agreement takes about two seconds.",
    "What was that?",
    [
      ["agree", "Agreement", "They already thought so."],
      ["close", "Closing the topic", "Agreeing is the fastest way to stop discussing it."],
      ["placate", "Placating", "They want the concerned person to feel heard."],
      ["avoid", "Avoiding a harder point", "There is something adjacent they do not want raised."],
    ],
    [
      ["e1", "The concern is never acted on afterwards.", "Raises closing and placating, lowers genuine agreement — though inaction has many causes."],
      ["e2", "They had raised the same concern themselves a month earlier in writing.", "Restores genuine agreement strongly. A prior commitment is good evidence about a belief."],
    ],
  ),
  S(
    "translated-bluntness",
    "The blunt reply",
    "A message arrives in a shared working language that is the sender's second language and the reader's first.",
    "It reads: “This is wrong. Send the correct file.”",
    "How should the bluntness be read?",
    [
      ["angry", "Annoyance", "The tone is the tone."],
      ["register", "Register transfer", "Directness that is neutral in their first language reads as sharp in this one."],
      ["urgent", "Urgency", "Something downstream is blocked and brevity is speed."],
      ["clarity", "A deliberate choice", "They have learned that hedged English gets misread and have stopped hedging."],
    ],
    [
      ["e1", "Their messages in the same thread to everyone, including people they are friendly with, have the same shape.", "Strong support for register transfer or deliberate choice; strong against annoyance."],
      ["e2", "The file was needed for something due within the hour.", "Raises urgency. Multiple sufficient explanations now coexist, which is the honest state of most real cases."],
    ],
  ),
  S(
    "asking-twice",
    "Asked twice",
    "A person asks a question in a group chat. Nobody answers. Six hours later they ask again, identically.",
    "The same words, posted again.",
    "What does the repetition express?",
    [
      ["practical", "Practical", "They still need the answer."],
      ["annoyed", "Annoyance", "The identical wording is pointed."],
      ["doubt", "Self-doubt", "They think the question was badly phrased or unwelcome."],
      ["visibility", "Bumping", "They assume it scrolled past and are only raising it in the feed."],
    ],
    [
      ["e1", "They added no words like “sorry to bump this”.", "Weakly raises annoyance and weakly lowers self-doubt; deliberately a weak discriminator to see whether participants move on thin evidence."],
      ["e2", "The chat had two hundred messages in between.", "Strongly raises 'bumping' and dissolves most of the apparent signal."],
    ],
  ),
  S(
    "declined-invite",
    "A declined invitation",
    "Someone invites a friend to a significant event. The friend declines, citing a prior commitment, and does not propose anything else.",
    "The decline is warm and brief.",
    "What does the absence of a counter-offer mean?",
    [
      ["literal", "Nothing", "There was a prior commitment and no counter-offer was called for."],
      ["distance", "Distance", "The friendship is drifting and this is the visible edge of it."],
      ["event", "About the event", "They do not want to attend this particular thing."],
      ["overload", "Overload", "They are declining everything at the moment."],
    ],
    [
      ["e1", "They ask afterwards how it went, in detail.", "Lowers distance; consistent with 'about the event' and overload."],
      ["e2", "They declined two other invitations the same month.", "Raises overload sharply. The second of the set's explicit base-rate items about a single person's behaviour."],
    ],
  ),
  S(
    "hedged-estimate",
    "“It should be ready by Thursday.”",
    "An engineer is asked when a piece of work will be finished.",
    "They answer: “It should be ready by Thursday.”",
    "What does “should” encode?",
    [
      ["confident", "Confidence with a formality", "Thursday is the estimate; the hedge is convention."],
      ["uncertain", "Real uncertainty", "There is a known risk they are not naming."],
      ["dependency", "A dependency", "It depends on someone else and they are declining to point at them."],
      ["pressure", "Pressure management", "The date was suggested to them and they are half-agreeing."],
    ],
    [
      ["e1", "Their last four estimates were phrased the same way and all landed on the stated day.", "A personal calibration record — the strongest kind of evidence available about an estimate, and rarely available in real life."],
      ["e2", "The person asking had said earlier that Thursday would be ideal.", "Raises pressure management; anchoring is a well-documented effect and this scenario is built to surface it."],
    ],
  ),
  S(
    "unexpected-formality",
    "A sudden “Dear”",
    "Two colleagues who normally write to each other in one-line messages with no greeting.",
    "One of them sends a message beginning “Dear —,” and signs off formally.",
    "What does the shift mean?",
    [
      ["serious", "Seriousness", "The content requires formality."],
      ["distance", "Deliberate distance", "The register is doing relational work."],
      ["forward", "Written to be forwarded", "They expect a third party to read it."],
      ["template", "A template", "They wrote it inside a system that formats messages this way."],
    ],
    [
      ["e1", "The content of the message is entirely routine — a scheduling detail.", "Raises distance and 'written to be forwarded'; lowers seriousness. Mismatch between form and content as evidence."],
      ["e2", "The message includes a reference number in the subject line.", "Raises the template reading substantially — an institutional explanation for what looked interpersonal."],
    ],
  ),
  S(
    "joke-at-expense",
    "A joke at someone's expense",
    "In a group, one person makes a joke about another's work. Everyone laughs, including the subject.",
    "The joke is funny, and it lands on a real weakness.",
    "What was it?",
    [
      ["affection", "Affection", "In this group, teasing is how closeness is expressed."],
      ["criticism", "Criticism in a safe wrapper", "A real point made where it cannot be objected to."],
      ["status", "A status move", "Aimed at the room more than the person."],
      ["careless", "Carelessness", "No intent — they did not model how it would land."],
    ],
    [
      ["e1", "The subject makes an equivalent joke back immediately and the group laughs again.", "Raises affection; symmetry is decent evidence about norms, though not about this speaker's intent."],
      ["e2", "The joker raised the same criticism seriously in a meeting last week and it was dismissed.", "Raises 'criticism in a safe wrapper' sharply. A strong test of whether participants revise a reading of tone on the basis of history."],
    ],
  ),
  S(
    "two-word-answer",
    "“It's done.”",
    "A person had pushed back hard against a task, then was asked to do it anyway.",
    "Two hours later: “It's done.”",
    "What is in the message?",
    [
      ["professional", "Professionalism", "They disagreed, they complied, the matter is closed."],
      ["resentment", "Resentment", "The brevity is the residue of the disagreement."],
      ["proof", "Proof of speed", "They are demonstrating that the objection was not about the work being hard."],
      ["neutral", "Nothing", "This is how they report completed work."],
    ],
    [
      ["e1", "The task had been estimated at a day and a half.", "Raises 'proof of speed' and resentment; a strong signal hiding in a schedule."],
      ["e2", "They attach a note listing three issues they hit, written helpfully.", "Raises professionalism and lowers resentment — again, effort as the discriminator."],
    ],
  ),
  S(
    "unclear-request",
    "“Can you look at this?”",
    "A message arrives with a link and one sentence.",
    "“Can you look at this?”",
    "What is being requested?",
    [
      ["review", "A review", "They want judgement and comments."],
      ["fix", "A fix", "They want the problem solved."],
      ["awareness", "Awareness", "They want you to know it exists."],
      ["cover", "Shared responsibility", "They want a second name attached to a decision."],
    ],
    [
      ["e1", "The link points to a document with tracked changes already in it from two other people.", "Raises review and shared responsibility; lowers 'fix'."],
      ["e2", "The sender is the person who will be accountable if it goes wrong.", "Raises shared responsibility. The set's clearest example of an interest-based rather than a text-based inference."],
    ],
  ),
  S(
    "delayed-congratulations",
    "Late congratulations",
    "Someone shares good news publicly. A close friend congratulates them nine days later, warmly and at length.",
    "Nine days.",
    "What does the delay mean?",
    [
      ["missed", "They missed it", "Feeds are not read exhaustively."],
      ["complex", "Complicated feelings", "The news touches something difficult for them."],
      ["deliberate", "Deliberate timing", "They waited until the noise died down so the message would land."],
      ["life", "Circumstance", "They were unreachable."],
    ],
    [
      ["e1", "The message references a detail that only appeared in a comment thread under the original post.", "Argues they saw it at the time, lowering 'missed'. A small forensic detail carrying real weight."],
      ["e2", "They were dealing with something hard of their own that fortnight, which the other person did not know about.", "Raises circumstance and complicated feelings, and demonstrates the central problem: the correct explanation was unavailable to the interpreter at the time."],
    ],
  ),
];
