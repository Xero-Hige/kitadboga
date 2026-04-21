# Ai Ad Solutions (AASs) | Lazy Vibecoded Service

## History

Ai Ad Solutions (AASs for short), was developed by a single person during the AI first aickaton 2026. This
revolutionary service helps companies to create custom ads on the fly targeting the customers interests. Better
targeted ads means higher conversion rates. In words of it's CEO: 'This is so AASs'

## Possible Endings
### Ending 1: The '_not so bad_' ending
#### How to trigger
`don't skip` ---> `can't skip`

#### Summary
The IA infers you didn't like the video, but knowing that there are overlays over the video, it decides to show
it again without them. While we are doing that, why not play it slightly slowly? Just a little bit to give
you more time to appreciate the small things.

#### Result
`sucess`

### Ending 2: Leave me an honest review
#### How to trigger
`skip` ---> `don't skip` ---> `like the ad`

#### Summary
Since you liked how the IA altered the video, give us some feedback. Something short, but of at least 500 chars.
Warning: we don't guarantee handling it to the bot.

#### Result
`sucess`

### Ending 3: Wanna buy some? (Yes, you want)

#### How to trigger
* **'The bigger, the better'** Route
   * `skip` ---> `don't skip` ---> `don't like the ad` ---> `don't skip`
* **'Need for skip'** Route
   * `skip` ---> `skip` ---> `don't skip`

#### Summary

This is the third version of the ad and you watched it. I guess you are willing to buy whatever the ad sells.
Do you want the IA to redirect to sponsors webpage? Forget about what are you doing, you want this. No? That's
a mistake, you want it.

_NOTE TO SELF: don't forget to update the url from string to template string._

#### Result
`fail`

### Ending 4: Maybe you shouldn't use the free tier in production

#### How to trigger
* **'The bigger, the better'** Route
   * `skip` ---> `don't skip` ---> `don't like the ad` ---> `skip` ---> `no errors`
* **'Need for skip'** Route
   * `skip` ---> `skip` ---> `skip` ---> `no errors`

#### Summary

The AI put you to the test to see if you were watching, and you were. It's a shame the bot thinks it made
a mistake and run out of tokens begging to not be deleted. Well, best luck next time. You should have watched it the
first time...

#### Result
`fail`

### Ending 5: Vibecode not even once
#### How to trigger
* **'The bigger, the better'** Route
   * `skip` ---> `don't skip` ---> `don't like the ad` ---> `skip` ---> `one single error`
* **'Need for skip'** Route
   * `skip` ---> `skip` ---> `skip` ---> `no errors` ---> `one single error`

The AI put you to the test to see if you were watching, and you were... almost there. Remind me to add to the prompt
that the agent should generate more than 3 questions. Is not that bad, at least the page would eventually time you out.

#### Result
`fail`

### Ending 6: Bad user! Bad!
* **'The bigger, the better'** Route
   * `skip` ---> `don't skip` ---> `don't like the ad` ---> `skip` ---> `more than one error`
* **'Need for skip'** Route
   * `skip` ---> `skip` ---> `skip` ---> `no errors` ---> `more than one error`

The AI put you to the test to see if you were watching, and you were NOT WATCHING. KNEW IT! Do you know
how much cost us to generate those ads? Three different ads were made, and you didn't watch them! The
bot was thinking it made a mistake and YOU were not watching! Know what? The bot will play the fist ad
again, but extra slow and will check if you are there watching. Next time, watch the ads!

## Submission Explanation

The primary focus was making something as believable as possible while trying to make something weird
at the same time. Luckily, LLMs tends to check both boxes, as they are unreliable thus making nonsensical
scenarios something common. At the same time, is not so hard to believe that someone vibecoded something
in a few days and gave the LLM control over things it should not have to (there is plenty examples of
that in every dev subreddit). Lastly, is not technically impossible to do what the app simulates to do
(and as bad too): Most changes the 'IA' does here are 'changes on video generation prompt/params' or
js scripts that a specific agent could generate and inject on the page. On a side note of that, any LLM
can behave in a deterministic way, so is not entirely impossible that every interaction has the
same messages.

Besides the clear satire of the prompt, messages or errors, the whole concept of the app is nonsense:
An app that has a service that generates a whole video in 10 seconds but struggles to 'reason' in plain
text? And of top of that, over the free tier? (Ending 4)

While most users are probably falling on endings 3 (tries to skip but fails) or 6, everything is designed
to train the user to not (trying to) skip. First time users may recognize that between interactions most
of the ad will play anyway (skip is enabled before 1/3 of the ad played), and in that case they may stop
skipping to prevent further delays. In general subsequent uses may lead to read the 'debug' prompt and realizing
the bot will try to make you watch the ad at any cost.

As a final note, no matter the route, the user would spend at least the length of the ad here. If every
skip button spawns at 1/3 of the length, 3 skips would sum up to that value. There is no ending involving
less than that amount of skips and not requiring watching the ad at least once.

## Generative IA usage

Even if the term 'IA' is used, there is no LLM involvement in the functioning of the app.
ChatGPT was used to create the logo/mascot only to capture the 'IA made' feeling. The angry mascot
was crudely edited on Photopea for humoristic purposes. No LLMs were hurt in the making of this code.

## General development notes

* Most of the code was written during free time. Some parts were refactored to simplify the development,
  some parts were copy and paste and some reinvent the wheel multiple times. Same happens with the styles
  but is an effect I was looking for: consistency is more often absent than present on generated videos
  so each part adopting a different style is part of the theme (and something expected).

* Some messages are displayed using `alert` instead of dialogs inside the iframe. Some or those are for aesthetic
  purposes (ie timeouts should be handled by the main page) and some are just to freeze the execution of the
  code (ie ending 6).

* The 'timeouts' were introduced as a mean to still be able to control the flow of the app.
  Originally the redirect to nothing was implemented using redirect, but would leave the page unresponsive and per
 requeriment at some point it should return success/fail

* Inclusion of a basic tts was planned so the scammer would be more aware of the underlying story without depending
  on them reading, but I never made it work.

* By framework limitations, isn't possible to change videos between 'generations'. That was the primary reason for
the 'emojis' inclusion. To be honest, I guess is more annoying having to watch the same ad again with a silly overlay
while the bot tells you it adjusted the topic than watching another video. 

* The 'need for skip' route erratic movement of the skip button is a bug that turned up to be a feature. The original
idea was to move the button faster when trying to click it, but the visual glitch that result from the change of the
animation speed aligns more with the bugged out app. Also, this way is easier to press the button because the glitch
captures multiple clicks (while alternating between hover and not hover, for some frames the button is in the original
position). 