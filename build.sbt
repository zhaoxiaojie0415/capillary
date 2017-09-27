name := """capillary"""

version := "1.3"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.4"

scalacOptions ++= Seq("-feature")

libraryDependencies ++= Seq(
    "org.apache.kafka" % "kafka_2.11" % "0.8.2.1"
      exclude("javax.jms", "jms")
      exclude("com.sun.jdmk", "jmxtools")
      exclude("com.sun.jmx", "jmxri")
      exclude("org.slf4j", "slf4j-simple"),
  "nl.grons" %% "metrics-scala" % "3.1.1",
  "com.codahale.metrics" % "metrics-json" % "3.0.1",
  "com.codahale.metrics" % "metrics-jvm" % "3.0.1",
  "org.apache.curator" % "curator-framework" % "2.6.0",
  "org.apache.curator" % "curator-recipes" % "2.6.0",
  "org.coursera" % "metrics-datadog" % "0.1.7"
)

mappings in Universal += file("stats-to-datadog.py") -> "stats-to-datadog.py"
