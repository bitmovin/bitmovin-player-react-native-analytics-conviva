export interface BitmovinConvivaAnalyticsPluginProps {
  /**
   * Override the pinned BitmovinConvivaAnalytics Swift package with a release.
   * The release must support the deployment targets of the selected Player package.
   * Cannot be combined with `bitmovinConvivaIosRevision`.
   */
  bitmovinConvivaIosVersion?: string;
  /**
   * Override the pinned BitmovinConvivaAnalytics Swift package revision.
   * Cannot be combined with `bitmovinConvivaIosVersion`.
   * @defaultValue The revision in `ios/dependencies.json`.
   */
  bitmovinConvivaIosRevision?: string;
}
