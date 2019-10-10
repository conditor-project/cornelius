import './filter.scss';
import template from './filter.template.html';
import angular from 'angular';
import debounce from 'lodash.debounce';

export const filter = {
  controller: function (jwtModalService, jwtService, conditorApiService, $rootScope) {
    $rootScope.$on('refresh', () => {
      this.apply();
    });

    this.$onInit = function () {
      this.optionsOrigin = {
        source: {},
        typeConditor: 'Tous les types',
        sameTypeConditor: false,
        publicationDate: {
          min: 0,
          max: 100,
          options: {
            floor: 0,
            ceil: 100,
            onChange: this.onChangePublicationDateForm
          }
        }
      };
      this.options = angular.copy(this.optionsOrigin);
      this.isSourceFormActive = false;
      this.isTypeConditorFormActive = false;
      this.initOptions().catch(response => {
        if (response.status === 401) this.openJwtModal({ force: true });
        console.error(response);
      });
    };

    this.initOptions = function () {
      return conditorApiService.getAggregationsTypeConditor(this.options).then(response => {
        const totalCount = response.data.aggregations.typeConditor.buckets
          .map(bucket => bucket.doc_count)
          .reduce((accumulator, currentValue) => accumulator + currentValue);
        this.typeConditor = [
          {
            key: this.optionsOrigin.typeConditor,
            doc_count: totalCount
          },
          ...response.data.aggregations.typeConditor.buckets
        ];
        return conditorApiService.getAggregationsSource(this.options);
      }).then(response => {
        response.data.aggregations.source.buckets.map(bucket => {
          this.optionsOrigin.source[bucket.key] = false;
        });
        this.options = angular.copy(this.optionsOrigin);
        this.sources = response.data.aggregations.source.buckets;
        return conditorApiService.getAggregationsPublicationDate(this.options);
      }).then(response => {
        const publicationDates = response.data.aggregations.publicationDate.buckets
          .filter(bucket => Boolean(parseInt(bucket.key, 10)))
          .filter(bucket => {
            const now = new Date();
            const minDate = now.setFullYear(now.getFullYear() - 10);
            const maxDate = now.setFullYear(now.getFullYear() + 10);
            const bucketDate = new Date(bucket.key);
            return bucketDate >= minDate && bucketDate <= maxDate;
          })
          .map(bucket => bucket.key);
        const publicationDateFloor = min(publicationDates);
        const publicationDateCeil = max(publicationDates);
        this.options.publicationDate.min = publicationDateFloor;
        this.options.publicationDate.options.floor = publicationDateFloor;
        this.options.publicationDate.max = publicationDateCeil;
        this.options.publicationDate.options.ceil = publicationDateCeil;
      });
    };

    this.openJwtModal = function (options = { force: false }) {
      jwtModalService.open(options).then(() => {
        return this.initOptions();
      }).then(() => {
        this.apply();
      });
    };

    this.apply = function () {
      if (!jwtService.getTokenJwt()) return this.openJwtModal({ force: true });
      const newOptions = angular.copy(this.options);
      conditorApiService.getAggregationsPublicationDate(this.options).then(response => {
        const publicationDates = response.data.aggregations.publicationDate.buckets
          .filter(bucket => Boolean(parseInt(bucket.key, 10)))
          .filter(bucket => {
            const now = new Date();
            const minDate = now.setFullYear(now.getFullYear() - 10);
            const maxDate = now.setFullYear(now.getFullYear() + 10);
            const bucketDate = new Date(bucket.key);
            return bucketDate >= minDate && bucketDate <= maxDate;
          })
          .map(bucket => bucket.key);
        const publicationDateFloor = min(publicationDates);
        const publicationDateCeil = max(publicationDates);
        const publicationDate = this.options.publicationDate;
        publicationDate.options.floor = publicationDateFloor;
        publicationDate.options.ceil = publicationDateCeil;
        if (publicationDate.min < publicationDateFloor) publicationDate.min = publicationDateFloor;
        if (publicationDate.max > publicationDateCeil) publicationDate.max = publicationDateCeil;
        this.isPublicationDateFormActive = (publicationDate.min !== publicationDate.options.floor || publicationDate.max !== publicationDate.options.ceil);
        return conditorApiService.getAggregationsSource(this.options);
      }).then(response => {
        this.sources.forEach(source => {
          source.doc_count = 0;
        });
        response.data.aggregations.source.buckets.map(bucket => {
          const source = this.sources.filter(source => source.key === bucket.key).pop();
          source.doc_count = bucket.doc_count;
        });
        return conditorApiService.getAggregationsTypeConditor(this.options);
      }).then(response => {
        const typeConditorBuckets = response.data.aggregations.typeConditor.buckets;
        this.typeConditor.forEach(typeConditor => {
          typeConditor.doc_count = 0;
        });
        const totalCount = typeConditorBuckets.length === 0 ? 0 : response.data.aggregations.typeConditor.buckets
          .map(bucket => bucket.doc_count)
          .reduce((accumulator, currentValue) => accumulator + currentValue);
        this.typeConditor[0].doc_count = totalCount;
        typeConditorBuckets.map(bucket => {
          const typeConditor = this.typeConditor.filter(typeConditor => typeConditor.key === bucket.key).pop();
          typeConditor.doc_count = bucket.doc_count;
        });
      }).catch(error => {
        console.error(error);
      }).then(() => {
        this.onOptionsChange({ newOptions });
      });
    };

    this.onChangeTitleAbstractForm = debounce(function () {
      this.isTitleAbstractFormActive = Boolean(this.options.titleAbstract);
      this.apply();
    }, 400);

    this.clearTitleAbstractForm = function () {
      this.isTitleAbstractFormActive = false;
      this.options.titleAbstract = '';
      this.apply();
    };

    this.onChangeAuthorForm = debounce(function () {
      this.isAuthorFormActive = Boolean(this.options.author);
      this.apply();
    }, 400);

    this.clearAuthorForm = function () {
      this.isAuthorFormActive = false;
      this.options.author = '';
      this.apply();
    };

    this.onChangeIdForm = debounce(function () {
      this.isIdFormActive = Boolean(this.options.id);
      this.apply();
    }, 400);

    this.clearIdForm = function () {
      this.isIdFormActive = false;
      this.options.id = '';
      this.apply();
    };

    this.onChangeAddressForm = debounce(function () {
      this.isAddressFormActive = Boolean(this.options.address);
      this.apply();
    }, 400);

    this.clearAddressForm = function () {
      this.isAddressFormActive = false;
      this.options.address = '';
      this.apply();
    };

    this.onChangeSourceForm = debounce(function () {
      this.isSourceFormActive = !angular.equals(this.options.source, this.optionsOrigin.source);
      this.apply();
    }, 200);

    this.onChangeTypeConditorForm = function () {
      this.isTypeConditorFormActive = !angular.equals(this.options.typeConditor, this.optionsOrigin.typeConditor);
      this.apply();
    };

    this.onChangePublicationDateForm = () => {
      this.isPublicationDateFormActive = (this.options.publicationDate.min !== this.options.publicationDate.options.floor || this.options.publicationDate.max !== this.options.publicationDate.options.ceil);
      this.apply();
    };
  },
  bindings: {
    onOptionsChange: '&'
  },
  template
};

function max (arr) {
  return [...arr].map(i => parseInt(i, 10)).sort((a, b) => b - a).slice(0, 1).pop();
}

function min (arr) {
  return [...arr].map(i => parseInt(i, 10)).sort((a, b) => a - b).slice(0, 1).pop();
}
