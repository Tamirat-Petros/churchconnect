Option Explicit

Dim shell, fso, projectDir, command, request, running, apiRunning
Dim envFile, envText, mongoLine, mongoUri, atPosition
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
projectDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Stop early with a clear message if Atlas example placeholders are still present.
envFile = projectDir & "\backend\.env"
If Not fso.FileExists(envFile) Then
  MsgBox "I couldn't find backend\.env. Please check that this launcher is beside the backend and frontend folders.", vbExclamation, "ChurchConnect"
  WScript.Quit
End If

Set envText = fso.OpenTextFile(envFile, 1, False)
mongoLine = ""
Do Until envText.AtEndOfStream
  command = envText.ReadLine
  If Left(command, 12) = "MONGODB_URI=" Then mongoLine = Mid(command, 13)
Loop
envText.Close

atPosition = InStr(mongoLine, "@")
If Len(mongoLine) = 0 Or atPosition = 0 Then
  MsgBox "The MongoDB address is missing or incomplete in backend\.env. Add the Atlas connection string there, then try again.", vbExclamation, "ChurchConnect"
  WScript.Quit
End If
mongoUri = Left(mongoLine, atPosition - 1)
If InStr(mongoUri, "<") > 0 Or InStr(mongoUri, ">") > 0 Then
  MsgBox "The Atlas connection string still has a placeholder in the username/password section. Replace the angle-bracket text with your Atlas database user's real username and password in backend\.env. Keep them private, save, then double-click this launcher again.", vbExclamation, "ChurchConnect"
  WScript.Quit
End If

' Start the API only if it is not already listening.
apiRunning = False
On Error Resume Next
Set request = CreateObject("WinHttp.WinHttpRequest.5.1")
request.SetTimeouts 500, 500, 500, 500
request.Open "GET", "http://127.0.0.1:5000/api/health", False
request.Send
If Err.Number = 0 Then apiRunning = True
Err.Clear
On Error GoTo 0

If Not apiRunning Then
  command = "cmd.exe /c cd /d """ & projectDir & """ && npm.cmd run dev:api > ""backend\startup.log"" 2>&1"
  shell.Run command, 0, False
End If

' Reuse the existing development server if one is already responding.
running = False
On Error Resume Next
Set request = CreateObject("WinHttp.WinHttpRequest.5.1")
request.SetTimeouts 500, 500, 500, 500
request.Open "GET", "http://127.0.0.1:5173/", False
request.Send
If Err.Number = 0 Then
  If request.Status = 200 Then running = True
End If
Err.Clear
On Error GoTo 0

If Not running Then
  command = "cmd.exe /c cd /d """ & projectDir & """ && npm.cmd run dev --workspace frontend -- --configLoader runner --host 127.0.0.1 > ""frontend\startup.log"" 2>&1"
  shell.Run command, 0, False
End If

' Wait up to 30 seconds for the API to confirm its MongoDB connection.
apiRunning = False
Dim attempt
For attempt = 1 To 30
  On Error Resume Next
  Set request = CreateObject("WinHttp.WinHttpRequest.5.1")
  request.SetTimeouts 800, 800, 800, 800
  request.Open "GET", "http://127.0.0.1:5000/api/health", False
  request.Send
  If Err.Number = 0 Then
    If request.Status = 200 Then apiRunning = True
  End If
  Err.Clear
  On Error GoTo 0
  If apiRunning Then Exit For
  WScript.Sleep 1000
Next

shell.Run "http://127.0.0.1:5173/", 1, False
If Not apiRunning Then
  MsgBox "The website was opened, but the API hasn't confirmed a database connection yet. If Atlas details are complete, wait a little and refresh. If it still fails, open backend\startup.log and send me a screenshot with any passwords or connection strings hidden.", vbInformation, "ChurchConnect"
End If
