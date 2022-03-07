#video 

move all video to redux state, what I will probably want to do is pass in functions to the AgoraVideoCall component so I can call redux function inside the pre-built hook

Video keeps getting re rendered because whenever a user is added or leaves, the list of usertracks is updated causing a re render

What I need to do is preselect the track for the specified user so that the video parent component doesnt only updates when its SPECIFIC track is changed by a role change or a video drop and 

also have each of these video component be top level 

